package se.comerit.avanza.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private AlertService alertService;

    @InjectMocks
    private PortfolioService portfolioService;

    private Long userId;

    @BeforeEach
    void setUp() {
        userId = 1L;
    }

    @Test
    @DisplayName("Bygg dashboard-data utan drift")
    void testBuildDashboardData_NoDrift() {
        // Arrange
        List<Map<String, Object>> accounts = new ArrayList<>();
        Map<String, Object> acc1 = new HashMap<>();
        acc1.put("id", 101);
        acc1.put("account_type", "ISK");
        acc1.put("account_name", "Min ISK");
        acc1.put("currency", "SEK");
        accounts.add(acc1);

        List<Map<String, Object>> holdings = new ArrayList<>();
        Map<String, Object> h1 = new HashMap<>();
        h1.put("id", 1L);
        h1.put("account_id", 101);
        h1.put("ticker", "VOLV-B");
        h1.put("instrument_name", "Volvo B");
        h1.put("quantity", new BigDecimal("10")); // Price 268.50 -> Value 2685.0 SEK
        h1.put("avg_buy_price", new BigDecimal("200.00"));
        h1.put("currency", "SEK");
        h1.put("asset_category", "Aktier");
        holdings.add(h1);

        List<Map<String, Object>> targets = new ArrayList<>();
        Map<String, Object> t1 = new HashMap<>();
        t1.put("asset_category", "Aktier");
        t1.put("target_pct", new BigDecimal("100.00")); // 100% target matchar 100% actual
        targets.add(t1);

        List<Map<String, Object>> alerts = new ArrayList<>();

        // Stubba databas-anrop i rätt ordning
        when(jdbcTemplate.queryForList(contains("WHERE user_id = ?"), eq(userId)))
                .thenReturn(accounts)  // Query 1
                .thenReturn(targets);  // Query 3

        when(jdbcTemplate.queryForList(contains("WHERE h.account_id IN"), eq(userId)))
                .thenReturn(holdings); // Query 2

        when(jdbcTemplate.queryForList(contains("WHERE user_id = ? AND dismissed = false"), eq(userId)))
                .thenReturn(alerts);   // Query 4

        // Act
        Map<String, Object> result = portfolioService.buildDashboardData(userId);

        // Assert
        assertNotNull(result);
        assertEquals(2685.0, (Double) result.get("totalPortfolioValue"));
        assertFalse((Boolean) result.get("anyDrift"));

        // Verifiera att inga alerts sparades i DB
        verify(alertService, never()).saveAlert(anyLong(), anyString(), anyString());
    }

    @Test
    @DisplayName("Bygg dashboard-data med valutaomvandling (USD -> SEK) och skapad drift-alert")
    void testBuildDashboardData_WithUsdAndDrift() {
        // Arrange
        List<Map<String, Object>> accounts = List.of(
                Map.of("id", 101, "account_type", "ISK", "currency", "SEK")
        );

        // 10 st AAPL @ 187.32 USD * 10.5 USD_TO_SEK = 19668.6 SEK
        List<Map<String, Object>> holdings = List.of(
                Map.of(
                        "id", 1L,
                        "account_id", 101,
                        "ticker", "AAPL",
                        "instrument_name", "Apple Inc",
                        "quantity", new BigDecimal("10"),
                        "avg_buy_price", new BigDecimal("150.00"),
                        "currency", "USD",
                        "asset_category", "Aktier"
                )
        );

        // Målet är 50% Aktier, men i detta test är Aktier 100% av portföljen (Drift = +50%, vilket är > 5% tröskel)
        List<Map<String, Object>> targets = List.of(
                Map.of("asset_category", "Aktier", "target_pct", new BigDecimal("50.00"))
        );

        List<Map<String, Object>> existingAlerts = new ArrayList<>();

        when(jdbcTemplate.queryForList(contains("WHERE user_id = ?"), eq(userId)))
                .thenReturn(accounts)
                .thenReturn(targets);

        when(jdbcTemplate.queryForList(contains("WHERE h.account_id IN"), eq(userId)))
                .thenReturn(holdings);

        when(jdbcTemplate.queryForList(contains("WHERE user_id = ? AND dismissed = false"), eq(userId)))
                .thenReturn(existingAlerts);

        // Act
        Map<String, Object> result = portfolioService.buildDashboardData(userId);

        // Assert
        assertNotNull(result);
        assertTrue((Boolean) result.get("anyDrift"));
        assertEquals(19668.6, (Double) result.get("totalPortfolioValue"));

        // Verifiera beräknade holdings
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> enrichedHoldings = (List<Map<String, Object>>) result.get("holdings");
        assertEquals(1, enrichedHoldings.size());
        assertEquals("USD->SEK", enrichedHoldings.get(0).get("displayCurrency"));

        // Verifiera att sparandet till alertService anropades för driften
        verify(alertService, times(1)).saveAlert(
                eq(userId),
                eq("DRIFT"),
                contains("Aktier-allokering avviker")
        );
    }
}