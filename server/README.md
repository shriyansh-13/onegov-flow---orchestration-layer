# OneGov Flow — Backend Engine (Phase 1)
SIH 2026 Prototype — Integration & Orchestration Layer

## Overview
OneGov Flow is an integration and orchestration layer positioned between citizen scholarship applications and heterogeneous government department systems.

Instead of requiring departments to rewrite their systems, OneGov Flow adapts their disparate schemas, date formats, and naming conventions into a unified Common Data Model (CDM), performs field-level verification, and generates a consolidated verification summary.

## Architecture
```
APPLICATION (APP-DEMO-001)
     ↓
ORCHESTRATOR SERVICE
     ↓
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ IDENTITY SYSTEM │ EDUCATION SYS   │  INCOME SYSTEM  │ DOCUMENT SYSTEM │
│ (UPPERCASE/DD/  │ (camelCase/DD-  │ (snake_case/    │ (nested person/ │
│  MM/YYYY)       │  MM-YYYY)       │  numbers)       │  doc array)     │
└────────┬────────┴────────┬────────┴────────┬────────┴────────┬────────┘
         ↓                 ↓                 ↓                 ↓
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ IDENTITY ADAPTER│ EDUCATION ADAPT │ INCOME ADAPTER  │ DOCUMENT ADAPTER│
└────────┬────────┴────────┬────────┴────────┬────────┴────────┬────────┘
         └─────────────────┼─────────────────┴─────────────────┘
                           ↓
                   COMMON DATA MODEL
                           ↓
                    MATCHING ENGINE
                           ↓
               UNIFIED VERIFICATION RESULT
```

## API Endpoints

- `GET /api/health`: Server health and engine status.
- `GET /api/applications/APP-DEMO-001`: Returns citizen demo application data.
- `GET /api/applications/APP-DEMO-001/department-data`: Returns raw heterogeneous responses from all 4 department systems.
- `POST /api/applications/APP-DEMO-001/verify`: Executes the full multi-department pipeline and returns field comparisons, adapter outputs, and summary.

## Running Tests
```bash
npm test
# or
npx tsx --test server/tests/**/*.test.ts
```
