# Mappstruktur för Avanza Team 1

```bash
chas-avanza/
├── backend/
│   └── AvanzaPortal/          ← Spring Boot 3.2 / Java 21 Maven-projekt
│       ├── pom.xml
│       ├── Dockerfile
│       └── src/
│           ├── main/java/se/comerit/avanza/
│           │   ├── api/
│           │   │   ├── BacktestLibrary.java
│           │   │   ├── exception/
│           │   │   │   └── JnaBridgeException.java
│           │   │   └── factory/
│           │   │   │   ├── BacktestinputData.java
│           │   │   │   └── ManufacturingTestRunner.java
│           │   ├── AvanzaPortalApplication.java
│           │   ├── controller/
│           │   │   ├── AlertController.java
│           │   │   ├── AllocationController.java
│           │   │   ├── AuthController.java
│           │   │   ├── BacktestController.java
│           │   │   ├── DashboardController.java
│           │   │   ├── exception/
│           │   │   │   ├── DataTransferCompleteException.java
│           │   │   │   └── EndpointReadyException.java
│           │   │   ├── HoldingController.java
│           │   │   └── PortfolioRestController.java
│           │   ├── dto/
│           │   │   ├── AccountDto.java
│           │   │   ├── AlertDto.java
│           │   │   ├── AllocationDto.java
│           │   │   ├── AuthResponse.java
│           │   │   ├── BacktestMetricsDto.java
│           │   │   ├── CreateHoldingRequest.java
│           │   │   ├── FxDto.java
│           │   │   ├── HoldingDto.java
│           │   │   ├── LoginRequest.java
│           │   │   ├── PortfolioResponse.java
│           │   │   ├── UpdateAllocationRequest.java
│           │   │   └── UserDto.java
│           │   ├── entity/
│           │   │   ├── Account.java
│           │   │   ├── Alert.java
│           │   │   ├── AssetCategory.java
│           │   │   ├── Holding.java
│           │   │   ├── TargetAllocation.java
│           │   │   └── User.java
│           │   ├── repository/
│           │   │   ├── AccountRepository.java
│           │   │   ├── AlertRepository.java
│           │   │   ├── HoldingRepository.java
│           │   │   ├── TargetAllocationRepository.java
│           │   │   └── UserRepository.java
│           │   ├── security/
│           │   │   ├── JwtAuthenticationFilter.java
│           │   │   ├── JwtService.java
│           │   │   ├── PasswordEncoderConfig.java
│           │   │   └── SecurityConfig.java
│           │   └── service/               ← Påbörjad utflyttning av affärslogik
│           │       ├── AlertService.java
│           │       ├── AllocationService.java
│           │       ├── AuthService.java
│           │       ├── BacktestService.java
│           │       ├── HoldingService.java
│           │       └── PortfolioService.java
│           └── main/resources/
│           │   ├── db/
│           │   │   └── migration/
│           │   │   │   ├── V1_init.sql
│           │   │   │   ├── V2_add_bcrypt_column.sql
│           │   │   │   ├── V3_migrate_users_to_bcrypt.sql
│           │   │   │   └── V4_add_asset_category.sql
│           │   ├── static/
│           │   │   └── images/
│           │   │   │   └── logo.png
│           │   │   └── style.css
│           │   └── templates/
│           │       ├── alerts.html
│           │       ├── dashboard.html
│           │       ├── holdings.html
│           │       ├── layout.html
│           │       └── login.html
│           └── test/java/se/comerit/avanza/service/
│               └── PortfolioServiceTest.java
├── docs/
│   ├── frontend/
│   │   ├── BESLUT.md
│   │   ├── BIDRAG.md
│   │   └── README.md
│   ├── architecture.md        ← Systembeskrivning
│   ├── known-bugs.md          ← Kända fel (er uppgiftslista)
│   ├── README-pain-points.md  ← Vad som spricker vid skala
│   └── v2-targets.md          ← Målarkitektur för v2
├── DRIFT.md                   ← Drift, deploy och plattformskontrakt
├── frontend/                  ← React 18 + Vite + TypeScript (v2)
│   ├── .env.development
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── STYLING.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── api/
│       │   ├──adapters/
│       │   │   ├── httpPortfolioApi.ts
│       │   │   └── mockPortfolioApi.ts
│       │   ├── httpClient.test.ts
│       │   ├── httpClient.ts
│       │   └── portfolioApi.ts
│       ├── App.css
│       ├── App.tsx
│       ├── assets/
│       │   ├── logo_bars.svg
│       │   ├── logo.png
│       │   └── logo.webp
│       ├── auth/
│       │   ├── auth.test.ts
│       │   ├── auth.ts
│       │   ├── authContext.ts
│       │   ├── AuthProvider.tsx
│       │   └── useAuth.ts
│       ├── components/
│       │   └── Dashboard/
│       │   │   ├── AccountsTable.module.css
│       │   │   ├── AccountsTable.tsx
│       │   │   ├── AllocationPieChart.module.css
│       │   │   ├── AllocationPieChart.tsx
│       │   │   ├── AssetAllocation.module.css
│       │   │   ├── AssetAllocation.tsx
│       │   │   ├── GoalAllocation.module.css
│       │   │   ├── GoalAllocation.test.tsx
│       │   │   ├── GoalAllocation.tsx
│       │   │   ├── HistoryChart.module.css
│       │   │   ├── HistoryChart.tsx
│       │   │   ├── HoldingsTable.module.css
│       │   │   ├── HoldingsTable.tsx
│       │   │   ├── InfoAside.module.css
│       │   │   ├── InfoAside.tsx
│       │   │   ├── NoticesEmpty.module.css
│       │   │   ├── NoticesEmpty.tsx
│       │   │   ├── PageHeader.module.css
│       │   │   ├── PageHeader.tsx
│       │   │   ├── SmallHoldingsTable.module.css
│       │   │   ├── SmallHoldingsTable.tsx
│       │   │   ├── WarningBanner.module.css
│       │   │   └── WarningBanner.tsx
│       │   └── Topbar/
│       │   │   ├── HamburgerMenu.module.css
│       │   │   ├── HamburgerMenu.tsx
│       │   │   ├── Topbar.module.css
│       │   │   └── Topbar.tsx
│       │   ├── MockModeBanner.test.tsx
│       │   ├── MockModeBanner.tsx
│       │   ├── Panel.module.css
│       │   ├── Panel.test.tsx
│       │   ├── Panel.tsx
│       │   └── ProtectedRoute.tsx
│       ├── data/
│       │   └── portfolio.json              ← Mockad portföljdata
│       ├── hooks/
│       │   ├── useHistories.ts
│       │   ├── useHistory.ts
│       │   ├── usePortfolio.ts
│       │   └── useSaveAllocation.ts
│       ├── index.css
│       ├── lib/
│       │   ├── drift.test.ts
│       │   ├── drift.ts
│       │   └── targetAllocation.ts
│       ├── main.tsx
│       ├── pages/
│       │   ├── Alerts.tsx
│       │   ├── Holdings.module.css
│       │   ├── Holdings.tsx
│       │   ├── Login.errors.test.tsx
│       │   ├── Login.module.css
│       │   ├── Login.test.tsx
│       │   ├── Login.tsx
│       │   ├── Portfolio.css
│       │   └── Portfolio.tsx
│       ├── test/
│       │   └── setup.ts
│       ├── types/
│       │   ├── auth.ts
│       │   ├── history.ts
│       │   └── portfolio.ts
│       └── vite-env.d.ts
├── infra/
│   ├── docker-compose.override.yml
│   ├── docker-compose.yml
│   └── seed.sql
├── native/
│   ├── backtest/
│   │   ├── tests/
│   │   │   ├── testing_file.cpp
│   │   │   └── tests.cpp
│   │   ├── backtest.cpp
│   │   ├── backtest.hpp
│   │   ├── CMakeLists.txt
│   ├── docs/
│   │   ├── v1-info/
│   │   │   └── README.md ← Start-infon för Native modulen (v1).
│   │   ├── BESLUT.md
│   │   ├── BIDRAG.md
│   │   ├── README.md ← Natives main README
│   ├── fx/
│   │   ├── test/
│   │   │   └── test_fx.cpp
│   │   ├── fx.cpp
│   │   ├── fx.hpp
│   ├── logger/
│   │   ├── test/
│   │   │   └── test_logger.cpp
│   │   ├── logger.cpp
│   │   └── logger.hpp
│   ├── risk/
│   │   ├── helpers/
│   │   │   ├── helpers.c
│   │   │   └── helpers.h
│   │   ├── tests/
│   │   │   └── test_risk.c
│   │   ├── risk.c
│   │   └── risk.h
│   └── .gitignore
├── .gitignore
└── README.md ← Huvud-README för hela projektet, länkar till teamens individuella README's
```