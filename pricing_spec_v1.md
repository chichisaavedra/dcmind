# 💰 DOCMIND - ESPECIFICACIÓN DE PRICING (VERSIÓN 1 FINAL)

## 🎯 RESUMEN EJECUTIVO

Sistema de 3 planes optimizado para margen 59-63%:
- FREE: Lead generation
- STARTER: Usuario casual ($7/mes)
- PRO: Profesional ($15/mes)

---

## 📋 PLAN FREE - $0/mes

### Límites Mensuales:
```json
{
  "plan_id": "free",
  "price_monthly": 0,
  "price_annual": 0,
  "limits": {
    "files_per_month": 10,
    "images_per_month": 3,
    "chatbot_questions_per_month": 5,
    "custom_rules": 0,
    "storage_bytes": 524288000
  },
  "features": {
    "ai_model": "deepseek-chat",
    "processing_delay_ms": 7000,
    "categorization": "automatic_basic",
    "custom_rules_enabled": false,
    "search": "basic",
    "notifications": "basic",
    "export": false,
    "integrations": false,
    "api_access": false,
    "support": "community"
  }
}
```

### Tecnología:
- **Documentos:** DeepSeek V3 (`deepseek-chat`)
- **Imágenes:** GPT-4o Vision (`gpt-4o`)
- **Delay artificial:** 7 segundos
- **Costo por archivo:** $0.003

### Features Incluidas:
✓ Categorización automática básica
✓ Búsqueda simple por nombre
✓ Notificaciones de vencimientos
✓ Análisis de nombres recurrentes

### Features Bloqueadas:
❌ Reglas personalizadas → Mostrar modal upgrade
❌ Exportación de datos
❌ Integraciones
❌ API access

---

## 📋 PLAN STARTER - $7/mes

### Precios:
```json
{
  "plan_id": "starter",
  "price_monthly_usd": 7.00,
  "price_annual_usd": 71.40,
  "price_monthly_annual": 5.95,
  "discount_annual_percent": 15
}
```

### Límites Mensuales:
```json
{
  "limits": {
    "files_per_month": 50,
    "images_per_month": 15,
    "chatbot_questions_per_month": 20,
    "custom_rules": 10,
    "storage_bytes": 2147483648
  }
}
```

### Tecnología:
- **Documentos:** Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`)
- **Imágenes:** GPT-4o Vision (`gpt-4o`)
- **Delay:** 0ms (procesamiento inmediato)
- **Costo por archivo:** $0.035 (análisis completo)

---

## 📋 PLAN PRO - $15/mes ⭐ MÁS POPULAR

### Precios:
```json
{
  "plan_id": "pro",
  "price_monthly_usd": 15.00,
  "price_annual_usd": 153.00,
  "price_monthly_annual": 12.75,
  "discount_annual_percent": 15,
  "badge": "MÁS POPULAR"
}
```

### Límites Mensuales:
```json
{
  "limits": {
    "files_per_month": 150,
    "images_per_month": 30,
    "chatbot_questions_per_month": 30,
    "custom_rules": 25,
    "storage_bytes": 5368709120
  }
}
```

### Tecnología:
- **Documentos:** Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`)
- **Imágenes:** GPT-4o Vision (`gpt-4o`)
- **Prioridad:** Alta
- **Delay:** 0ms
