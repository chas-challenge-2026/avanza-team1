package se.comerit.avanza.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import se.comerit.avanza.dto.AlphaVantageDailyResponse;
import se.comerit.avanza.dto.DailyPriceDto;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
public class AlphaVantageService {

    private final RestClient restClient;

    @Value("${alphavantage.api.key}")
    private String apiKey;

    @Value("${alphavantage.api.url}")
    private String baseUrl;

    public AlphaVantageService() {
        this.restClient = RestClient.create();
    }

    /**
     * Hämtar historik baserat på vald tidsintervall (1M, 6M, 1Y, 10Y, ALLT).
     * Resultatet cachas per ticker och tidsintervall.
     */
    @Cacheable(value = "stockHistory", key = "#ticker + '_' + #range")
    public List<DailyPriceDto> getHistoryForRange(String ticker, String range) {
        try {
            String upperRange = range != null ? range.toUpperCase() : "1Y";

            // "compact" returnerar 100 datapunkter, "full" behövs för längre historik (upp till 20+ år)
            String outputSize = ("1M".equals(upperRange) || "6M".equals(upperRange)) ? "compact" : "full";

            String url = String.format("%s?function=TIME_SERIES_DAILY&symbol=%s&outputsize=%s&apikey=%s",
                    baseUrl, ticker, outputSize, apiKey);

            AlphaVantageDailyResponse response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(AlphaVantageDailyResponse.class);

            if (response == null || response.timeSeries() == null) {
                return Collections.emptyList();
            }

            LocalDate cutoffDate = switch (upperRange) {
                case "1M" -> LocalDate.now().minusMonths(1);
                case "6M" -> LocalDate.now().minusMonths(6);
                case "1Y" -> LocalDate.now().minusYears(1);
                case "10Y", "ALLT" -> LocalDate.now().minusYears(10);
                default -> LocalDate.now().minusYears(1);
            };

            return response.timeSeries().entrySet().stream()
                    .map(entry -> {
                        LocalDate date = LocalDate.parse(entry.getKey());
                        var data = entry.getValue();
                        return new DailyPriceDto(
                                date,
                                Double.parseDouble(data.open()),
                                Double.parseDouble(data.high()),
                                Double.parseDouble(data.low()),
                                Double.parseDouble(data.close()),
                                Long.parseLong(data.volume())
                        );
                    })
                    .filter(dto -> !dto.date().isBefore(cutoffDate))
                    .sorted((a, b) -> a.date().compareTo(b.date()))
                    .toList();

        } catch (Exception e) {
            System.err.println("Fel vid hämtning av historik för " + ticker + ": " + e.getMessage());
            return Collections.emptyList();
        }
    }
}