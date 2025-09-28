# DDP Framework API Reference

## Overview

The Dynamic Digital Privacy Framework provides RESTful APIs for policy management, compliance checking, and governance workflows. All endpoints use JSON for request/response payloads and require authentication.

## Base URL

```
Production: https://api.ddp-framework.org/v1
Staging: https://staging-api.ddp-framework.org/v1
```

## Authentication

All API requests require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Token Acquisition

```http
POST /auth/token
Content-Type: application/json

{
    "client_id": "your-client-id",
    "client_secret": "your-client-secret",
    "grant_type": "client_credentials"
}
```

## Policy Management API

### List Policies

```http
GET /policies
```

**Response:**
```json
{
    "policies": [
        {
            "id": "gdpr_art25",
            "name": "Data Protection by Design & Default",
            "regulation": "GDPR Article 25",
            "status": "active",
            "version": "1.2.0",
            "created_at": "2025-01-15T10:00:00Z",
            "updated_at": "2025-03-10T14:30:00Z"
        }
    ],
    "total": 47,
    "page": 1,
    "per_page": 20
}
```

### Get Policy Details

```http
GET /policies/{policy_id}
```

**Response:**
```json
{
    "id": "gdpr_art25",
    "name": "Data Protection by Design & Default",
    "regulation": "GDPR Article 25",
    "description": "Ensures data protection principles are integrated into processing activities from the outset",
    "code": "package gdpr.art25\n\ndeny {\n  resource := input.resource_changes[_]\n  resource.type == "aws_s3_bucket"\n  resource.change.after.server_side_encryption_configuration == null\n}",
    "tests": [
        {
            "name": "test_encrypted_bucket_allowed",
            "input": {...},
            "expected": "allow"
        }
    ],
    "metadata": {
        "author": "legal-team",
        "reviewers": ["security-team", "engineering-team"],
        "tags": ["encryption", "gdpr", "infrastructure"]
    }
}
```

### Create Policy

```http
POST /policies
Content-Type: application/json

{
    "name": "Custom Data Retention Policy",
    "regulation": "CCPA Section 1798.105",
    "description": "Enforces data retention limits",
    "code": "package ccpa.retention\n\ndeny {\n  resource := input.resource_changes[_]\n  resource.type == "aws_cloudwatch_log_group"\n  resource.change.after.retention_in_days > 90\n}",
    "tests": [...]
}
```

### Update Policy

```http
PUT /policies/{policy_id}
Content-Type: application/json

{
    "code": "updated Rego code",
    "version": "1.3.0",
    "change_reason": "Added support for new resource types"
}
```

### Delete Policy

```http
DELETE /policies/{policy_id}
```

## Compliance Evaluation API

### Evaluate Compliance

```http
POST /evaluate
Content-Type: application/json

{
    "input": {
        "resource_changes": [
            {
                "type": "aws_s3_bucket",
                "name": "user-data-bucket",
                "change": {
                    "after": {
                        "server_side_encryption_configuration": null,
                        "public_read_access": false
                    }
                }
            }
        ],
        "metadata": {
            "environment": "production",
            "requester": "deploy-bot",
            "timestamp": "2025-09-28T02:00:00Z"
        }
    },
    "policies": ["gdpr_art25", "gdpr_art32"],
    "mode": "strict"
}
```

**Response:**
```json
{
    "evaluation_id": "eval-abc123",
    "result": "deny",
    "violations": [
        {
            "policy": "gdpr_art25",
            "message": "S3 bucket 'user-data-bucket' lacks server-side encryption",
            "severity": "high",
            "resource": "aws_s3_bucket.user-data-bucket",
            "remediation": "Enable server-side encryption with AES-256 or KMS"
        }
    ],
    "allowed_resources": [],
    "execution_time_ms": 45
}
```

### Batch Evaluation

```http
POST /evaluate/batch
Content-Type: application/json

{
    "evaluations": [
        {
            "id": "eval1",
            "input": {...},
            "policies": ["gdpr_art25"]
        },
        {
            "id": "eval2", 
            "input": {...},
            "policies": ["ccpa_opt_out"]
        }
    ]
}
```

### Get Evaluation History

```http
GET /evaluations?start_date=2025-09-01&end_date=2025-09-28&status=deny
```

## Governance API

### Submit Exception Request

```http
POST /governance/exceptions
Content-Type: application/json

{
    "policy_id": "gdpr_art25",
    "resource": "aws_s3_bucket.migration-temp",
    "justification": "Temporary bucket for data migration",
    "proposed_mitigation": "CloudTrail logging + time-limited access",
    "duration_hours": 24,
    "risk_level": "medium",
    "requester": "data-migration-team"
}
```

**Response:**
```json
{
    "exception_id": "exc-456789",
    "status": "pending_review",
    "tier": 2,
    "assigned_reviewers": ["legal-team", "security-team"],
    "estimated_review_time": "4 hours",
    "created_at": "2025-09-28T02:00:00Z"
}
```

### Get Exception Status

```http
GET /governance/exceptions/{exception_id}
```

**Response:**
```json
{
    "exception_id": "exc-456789",
    "status": "approved",
    "tier": 2,
    "approval_reason": "Valid business justification with appropriate mitigations",
    "approved_by": "security-lead",
    "approved_at": "2025-09-28T06:15:00Z",
    "expires_at": "2025-09-29T02:00:00Z",
    "conditions": [
        "Must enable CloudTrail logging",
        "Restrict access to migration team only",
        "Delete bucket within 24 hours"
    ]
}
```

### Escalate to Ethics Board

```http
POST /governance/escalate
Content-Type: application/json

{
    "request_id": "req-789012",
    "issue_type": "novel_technology",
    "description": "AI model training using biometric data",
    "ethical_concerns": [
        "Consent ambiguity",
        "Potential for discrimination",
        "Long-term privacy implications"
    ],
    "urgency": "normal"
}
```

### Get Governance Metrics

```http
GET /governance/metrics?timeframe=7d
```

**Response:**
```json
{
    "timeframe": "7 days",
    "metrics": {
        "tier1_automated": {
            "total_processed": 5934,
            "success_rate": 0.88,
            "avg_processing_time_ms": 156
        },
        "tier2_exceptions": {
            "submitted": 23,
            "approved": 18,
            "denied": 3,
            "pending": 2,
            "avg_review_time_hours": 6.2
        },
        "tier3_ethics": {
            "cases_submitted": 1,
            "cases_resolved": 0,
            "avg_deliberation_days": 4.2
        }
    }
}
```

## Monitoring API

### Get System Status

```http
GET /status
```

**Response:**
```json
{
    "status": "healthy",
    "version": "2025.1.0",
    "uptime_seconds": 2847293,
    "components": {
        "policy_engine": "healthy",
        "database": "healthy", 
        "cache": "healthy",
        "message_queue": "degraded"
    },
    "metrics": {
        "requests_per_second": 847,
        "avg_response_time_ms": 89,
        "error_rate": 0.002
    }
}
```

### Get Performance Metrics

```http
GET /metrics?metric=policy_violation_rate&timeframe=24h
```

**Response:**
```json
{
    "metric": "policy_violation_rate",
    "timeframe": "24 hours",
    "data_points": [
        {
            "timestamp": "2025-09-28T00:00:00Z",
            "value": 0.12
        },
        {
            "timestamp": "2025-09-28T01:00:00Z", 
            "value": 0.15
        }
    ],
    "summary": {
        "current": 0.12,
        "average": 0.13,
        "min": 0.08,
        "max": 0.18,
        "trend": "decreasing"
    }
}
```

## Webhook API

### Register Webhook

```http
POST /webhooks
Content-Type: application/json

{
    "url": "https://your-system.com/ddp-webhook",
    "events": [
        "policy.violation.detected",
        "exception.approved", 
        "ethical.decision.made"
    ],
    "secret": "your-webhook-secret",
    "active": true
}
```

### Webhook Payload Example

```json
{
    "event": "policy.violation.detected",
    "timestamp": "2025-09-28T02:15:00Z",
    "data": {
        "violation_id": "viol-123456",
        "policy_id": "gdpr_art25",
        "resource": "aws_s3_bucket.sensitive-data",
        "severity": "high",
        "message": "Unencrypted S3 bucket detected",
        "metadata": {
            "environment": "production",
            "requester": "api-service"
        }
    },
    "signature": "sha256=hash-of-payload"
}
```

## Error Handling

All API errors follow a consistent format:

```json
{
    "error": {
        "code": "POLICY_NOT_FOUND",
        "message": "Policy with ID 'invalid-id' not found",
        "details": {
            "requested_id": "invalid-id",
            "suggestion": "Check policy ID or use GET /policies to list available policies"
        }
    },
    "request_id": "req-abc123",
    "timestamp": "2025-09-28T02:00:00Z"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Request payload is malformed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

API requests are rate-limited per client:

- **Standard**: 1000 requests/hour
- **Premium**: 10000 requests/hour
- **Enterprise**: Unlimited

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 2025-09-28T03:00:00Z
```

## SDK Examples

### Python SDK

```python
from ddp_framework import DDPClient

client = DDPClient(
    api_key="your-api-key",
    base_url="https://api.ddp-framework.org/v1"
)

# Evaluate compliance
result = client.evaluate({
    "resource_changes": [...],
    "policies": ["gdpr_art25"]
})

if result.violations:
    for violation in result.violations:
        print(f"Violation: {violation.message}")
```

### JavaScript SDK

```javascript
import { DDPFramework } from '@ddp/framework-js';

const client = new DDPFramework({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.ddp-framework.org/v1'
});

// Submit exception request
const exception = await client.governance.submitException({
    policyId: 'gdpr_art25',
    justification: 'Emergency maintenance',
    durationHours: 2
});

console.log(`Exception ${exception.id} submitted for review`);
```

This API reference provides comprehensive documentation for integrating with the DDP Framework, enabling automated privacy governance across your technology stack.
