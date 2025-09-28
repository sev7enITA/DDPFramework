// Dynamic Digital Privacy Framework - Interactive Demo
// IEEE ISOPE 2025 Presentation

class DDPFramework {
    constructor() {
        this.simulationRunning = false;
        this.simulationInterval = null;
        this.complianceChart = null;
        this.currentMetrics = {
            mttr: 8,
            violationRate: 12,
            exceptionRate: 0.3,
            auditTime: 1
        };
        
        this.init();
    }

    init() {
        this.initTabNavigation();
        this.initSimulation();
        this.initPolicyEditor();
        this.initComplianceChart();
        this.initDocumentationNav();
        this.startRealTimeUpdates();
        this.initInteractiveElements();
    }

    // Tab Navigation
    initTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                
                // Update active states
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    // Simulation Controls
    initSimulation() {
        const simulationToggle = document.querySelector('.simulation-toggle');
        
        simulationToggle.addEventListener('click', () => {
            if (this.simulationRunning) {
                this.stopSimulation();
                simulationToggle.textContent = 'Start Simulation';
                simulationToggle.classList.remove('active');
            } else {
                this.startSimulation();
                simulationToggle.textContent = 'Stop Simulation';
                simulationToggle.classList.add('active');
            }
        });
    }

    startSimulation() {
        this.simulationRunning = true;
        
        // Add new alerts periodically
        this.simulationInterval = setInterval(() => {
            this.generateRandomAlert();
            this.updateMetrics();
            this.updatePipelineStatus();
        }, 3000);
        
        this.showNotification('Simulation started - Real-time privacy framework demonstration active', 'success');
    }

    stopSimulation() {
        this.simulationRunning = false;
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
        
        this.showNotification('Simulation stopped', 'info');
    }

    // Policy Editor
    initPolicyEditor() {
        const policySelector = document.querySelector('.policy-selector');
        const codeEditor = document.querySelector('#policy-code-editor .rego-code');
        const deployBtn = document.querySelector('.editor-controls .btn--primary');
        
        const policies = {
            gdpr_art25: `package gdpr.art25

# GDPR Article 25: Data Protection by Design & Default
# Ensures encryption is enforced for all data storage

deny {
  resource := input.resource_changes[_]
  resource.type == "aws_s3_bucket"
  resource.change.after.server_side_encryption_configuration == null
}

deny {
  resource := input.resource_changes[_]
  resource.type == "aws_rds_instance"
  resource.change.after.storage_encrypted == false
}

allow {
  input.request.encryption_enabled == true
  input.request.compliance_verified == true
}`,
            gdpr_art17: `package gdpr.art17

# GDPR Article 17: Right to Erasure (Right to be Forgotten)
# Ensures data can be deleted upon valid request

allow {
  input.request.type == "data_deletion"
  input.user.consent_status == "withdrawn"
  input.system.supports_deletion == true
}

deny {
  input.request.type == "data_deletion"
  input.data.legal_hold == true
}

require_approval {
  input.request.type == "data_deletion"
  input.data.retention_period > 0
  input.data.business_critical == true
}`,
            ccpa_1798: `package ccpa.section1798

# CCPA Section 1798.100: Consumer Rights
# Right to know about personal information collection

allow {
  input.request.type == "data_access"
  input.consumer.verified == true
  input.business.has_privacy_policy == true
}

require_notice {
  input.action == "data_collection"
  input.categories contains "personal_info"
  input.purposes != null
}

deny {
  input.action == "data_sale"
  input.consumer.opt_out == true
}`
        };

        if (policySelector && codeEditor) {
            policySelector.addEventListener('change', (e) => {
                const selectedPolicy = e.target.value;
                if (policies[selectedPolicy]) {
                    codeEditor.textContent = policies[selectedPolicy];
                    this.highlightSyntax(codeEditor);
                }
            });
        }

        if (deployBtn) {
            deployBtn.addEventListener('click', () => {
                this.deployPolicy();
            });
        }
    }

    deployPolicy() {
        const policyName = document.querySelector('.policy-selector').value;
        
        // Simulate policy deployment
        this.showNotification(`Policy ${policyName} deployed successfully to CI/CD pipeline`, 'success');
        
        // Update compliance metrics
        setTimeout(() => {
            this.updateComplianceChart();
            this.showNotification('Policy enforcement active - Scanning infrastructure...', 'info');
        }, 2000);
    }

    highlightSyntax(element) {
        // Simple syntax highlighting for Rego code
        let content = element.textContent;
        
        // Highlight keywords
        content = content.replace(/\b(package|import|deny|allow|default|rule|with|as|if|else|some|in|contains|count|sum|max|min)\b/g, 
            '<span style="color: #ffc185; font-weight: bold;">$1</span>');
        
        // Highlight comments
        content = content.replace(/(#.*$)/gm, '<span style="color: #5d878f; font-style: italic;">$1</span>');
        
        // Highlight strings
        content = content.replace(/(".*?")/g, '<span style="color: #1fb8cd;">$1</span>');
        
        element.innerHTML = content;
    }

    // Compliance Chart
    initComplianceChart() {
        const ctx = document.getElementById('complianceChart');
        if (!ctx) return;

        this.complianceChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['GDPR Compliant', 'CCPA Compliant', 'CPRA Compliant', 'Non-Compliant'],
                datasets: [{
                    data: [94, 91, 89, 8],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            color: '#f5f5f5'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    updateComplianceChart() {
        if (!this.complianceChart) return;
        
        // Simulate improvement in compliance
        const currentData = this.complianceChart.data.datasets[0].data;
        currentData[0] = Math.min(98, currentData[0] + Math.random() * 2);
        currentData[1] = Math.min(96, currentData[1] + Math.random() * 2);
        currentData[2] = Math.min(94, currentData[2] + Math.random() * 2);
        currentData[3] = Math.max(2, currentData[3] - Math.random() * 2);
        
        this.complianceChart.update();
    }

    // Real-time Updates
    startRealTimeUpdates() {
        setInterval(() => {
            this.updateDashboardMetrics();
        }, 5000);
    }

    updateMetrics() {
        // Simulate metric changes during simulation
        if (this.simulationRunning) {
            this.currentMetrics.mttr += (Math.random() - 0.5) * 2;
            this.currentMetrics.violationRate += (Math.random() - 0.6) * 3;
            this.currentMetrics.exceptionRate += (Math.random() - 0.5) * 0.1;
            
            // Keep values within realistic bounds
            this.currentMetrics.mttr = Math.max(1, Math.min(30, this.currentMetrics.mttr));
            this.currentMetrics.violationRate = Math.max(0, Math.min(25, this.currentMetrics.violationRate));
            this.currentMetrics.exceptionRate = Math.max(0, Math.min(2, this.currentMetrics.exceptionRate));
        }
    }

    updateDashboardMetrics() {
        const mttrElement = document.getElementById('mttr');
        const violationElement = document.getElementById('violation-rate');
        const exceptionElement = document.getElementById('exception-rate');
        
        if (mtrrElement) {
            mttrElement.textContent = Math.round(this.currentMetrics.mttr) + ' min';
        }
        if (violationElement) {
            violationElement.textContent = this.currentMetrics.violationRate.toFixed(1) + '%';
        }
        if (exceptionElement) {
            exceptionElement.textContent = this.currentMetrics.exceptionRate.toFixed(1) + '%';
        }
    }

    // Alert System
    generateRandomAlert() {
        const alerts = [
            {
                type: 'policy_violation',
                severity: 'high',
                message: 'Unencrypted database deployment blocked in CI/CD pipeline',
                icon: '⚠️'
            },
            {
                type: 'exception_request',
                severity: 'medium',
                message: 'Temporary encryption bypass requested for data migration',
                icon: '📋'
            },
            {
                type: 'compliance_check',
                severity: 'low',
                message: 'Weekly GDPR compliance report generated',
                icon: '📊'
            },
            {
                type: 'policy_update',
                severity: 'medium',
                message: 'New privacy policy deployed to production environment',
                icon: '🔄'
            },
            {
                type: 'audit_ready',
                severity: 'low',
                message: 'System audit trail updated and ready for review',
                icon: '✅'
            }
        ];
        
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        this.addAlert(randomAlert);
    }

    addAlert(alert) {
        const alertsBanner = document.getElementById('alerts-banner');
        if (!alertsBanner) return;
        
        const alertElement = document.createElement('div');
        alertElement.className = `alert-item ${alert.severity}`;
        alertElement.innerHTML = `
            <div class="alert-icon">${alert.icon}</div>
            <div class="alert-content">
                <div class="alert-title">${alert.type.replace('_', ' ').toUpperCase()}</div>
                <div class="alert-message">${alert.message}</div>
            </div>
            <div class="alert-time">Just now</div>
        `;
        
        // Add to top of alerts
        alertsBanner.insertBefore(alertElement, alertsBanner.firstChild);
        
        // Remove old alerts (keep only 3)
        const alerts = alertsBanner.querySelectorAll('.alert-item');
        if (alerts.length > 3) {
            alerts[alerts.length - 1].remove();
        }
        
        // Fade in animation
        alertElement.style.opacity = '0';
        alertElement.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            alertElement.style.transition = 'all 0.3s ease';
            alertElement.style.opacity = '1';
            alertElement.style.transform = 'translateY(0)';
        }, 100);
    }

    // Pipeline Status Updates
    updatePipelineStatus() {
        if (!this.simulationRunning) return;
        
        const stages = document.querySelectorAll('.pipeline-stage');
        const runningStage = document.querySelector('.pipeline-stage.running');
        
        if (runningStage && Math.random() > 0.7) {
            // Simulate stage completion
            runningStage.classList.remove('running');
            runningStage.classList.add('passed');
            runningStage.querySelector('.stage-icon').textContent = '✓';
            runningStage.querySelector('.stage-icon').classList.remove('loading');
            
            // Move to next stage
            const nextStage = runningStage.nextElementSibling?.nextElementSibling; // Skip arrow
            if (nextStage && nextStage.classList.contains('pending')) {
                nextStage.classList.remove('pending');
                nextStage.classList.add('running');
                nextStage.querySelector('.stage-icon').textContent = '⟳';
                nextStage.querySelector('.stage-icon').classList.add('loading');
            }
        }
    }

    // Documentation Navigation
    initDocumentationNav() {
        const docLinks = document.querySelectorAll('.doc-link');
        const docSections = document.querySelectorAll('.doc-section');
        
        docLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active states
                docLinks.forEach(l => l.classList.remove('active'));
                
                // Add active state
                e.target.classList.add('active');
                
                // Scroll to section
                const targetId = e.target.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // Interactive Elements
    initInteractiveElements() {
        // Remediation buttons
        const remediateButtons = document.querySelectorAll('.scan-item .btn');
        remediateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const scanItem = e.target.closest('.scan-item');
                const severity = scanItem.classList.contains('critical') ? 'critical' : 
                               scanItem.classList.contains('high') ? 'high' : 'medium';
                
                e.target.textContent = 'Processing...';
                e.target.disabled = true;
                
                setTimeout(() => {
                    scanItem.style.opacity = '0.5';
                    e.target.textContent = 'Resolved';
                    e.target.classList.add('btn--success');
                    this.showNotification(`${severity.toUpperCase()} security issue resolved automatically`, 'success');
                }, 2000);
            });
        });
        
        // Infrastructure code tabs
        const editorTabs = document.querySelectorAll('.editor-tab');
        const codeEditor = document.querySelector('.iac-code pre code');
        
        const codeExamples = {
            'terraform/main.tf': `# Terraform configuration with privacy policy enforcement
resource "aws_s3_bucket" "data_lake" {
  bucket = "company-data-lake-\${random_id.bucket_suffix.hex}"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "AES256"
        kms_master_key_id = aws_kms_key.data_key.arn
      }
    }
  }

  versioning {
    enabled = true
  }

  # Privacy policy enforcement
  tags = {
    DataClassification = "PII"
    RetentionPeriod   = "7years"
    ComplianceScope   = "GDPR,CCPA"
  }
}`,
            'policies/privacy.rego': `package terraform.privacy

# Deny unencrypted storage resources
deny[msg] {
  input.resource_changes[_].type == "aws_s3_bucket"
  input.resource_changes[_].change.after.server_side_encryption_configuration == null
  msg := "S3 bucket must have server-side encryption enabled"
}

# Require proper data classification tags
deny[msg] {
  input.resource_changes[_].type == "aws_s3_bucket"
  tags := input.resource_changes[_].change.after.tags
  not tags.DataClassification
  msg := "S3 bucket must have DataClassification tag"
}`,
            'results/scan.json': `{
  "summary": {
    "total_resources": 45,
    "policy_violations": 2,
    "warnings": 3,
    "passed": 40
  },
  "violations": [
    {
      "policy": "privacy.encryption_required",
      "resource": "aws_rds_instance.user_data",
      "message": "Database instance must have encryption enabled",
      "severity": "HIGH"
    },
    {
      "policy": "privacy.data_classification",
      "resource": "aws_s3_bucket.logs",
      "message": "Missing required DataClassification tag",
      "severity": "MEDIUM"
    }
  ]
}`
        };
        
        editorTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Update active tab
                editorTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update code content
                const tabName = e.target.textContent;
                if (codeExamples[tabName] && codeEditor) {
                    codeEditor.textContent = codeExamples[tabName];
                }
            });
        });
        
        // Module boxes hover effects
        const moduleBoxes = document.querySelectorAll('.module-box');
        moduleBoxes.forEach(box => {
            box.addEventListener('mouseenter', () => {
                box.style.transform = 'translateX(8px) scale(1.02)';
            });
            
            box.addEventListener('mouseleave', () => {
                box.style.transform = 'translateX(4px) scale(1)';
            });
        });
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-left: 4px solid ${this.getNotificationColor(type)};
            border-radius: var(--radius-base);
            padding: var(--space-12) var(--space-16);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--color-text-secondary);
            cursor: pointer;
            font-size: 18px;
            padding: 0;
            margin-left: var(--space-12);
        `;
        
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
    
    getNotificationColor(type) {
        const colors = {
            success: 'var(--color-success)',
            error: 'var(--color-error)',
            warning: 'var(--color-warning)',
            info: 'var(--color-info)'
        };
        return colors[type] || colors.info;
    }
    
    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DDPFramework();
    
    // Add some initial dynamic content
    setTimeout(() => {
        // Simulate initial system status
        const statusElements = document.querySelectorAll('.metric-value');
        statusElements.forEach((element, index) => {
            element.style.animation = `pulse 2s ease-in-out ${index * 0.2}s infinite alternate`;
        });
        
        // Add welcome message
        console.log('🔒 Dynamic Digital Privacy Framework v2025.1 - IEEE ISOPE 2025');
        console.log('📊 Interactive demonstration active');
        console.log('🚀 Click "Start Simulation" to see real-time privacy enforcement');
    }, 1000);
});

// Add some CSS animations for interactive elements
const style = document.createElement('style');
style.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-8);
    }
    
    .notification-message {
        flex: 1;
        font-size: var(--font-size-sm);
        line-height: 1.4;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.05); }
    }
    
    .metric-card:hover .metric-value {
        color: var(--color-primary-hover);
    }
    
    .tier-card:hover {
        border-color: var(--color-primary);
    }
    
    .workflow-step:hover {
        background: var(--color-bg-1) !important;
    }
    
    .scan-item:hover {
        transform: translateX(4px);
    }
    
    .threat-item:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    .version-item:hover .version-marker {
        transform: scale(1.2);
        background: var(--color-primary-hover);
    }
    
    .editor-tab:hover:not(.active) {
        background: var(--color-secondary);
    }
`;
document.head.appendChild(style);