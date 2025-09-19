/**
 * Security Dashboard Component
 * SRP: Security monitoring and audit results display ONLY
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    Lock,
    Key,
    Database,
    Settings,
    RefreshCw,
} from 'lucide-react';
import {
    SecurityHardeningService,
    SecurityVulnerability,
    SecurityAuditReport
} from '@/services/securityAuditService';

interface SecurityDashboardProps {
    className?: string;
    autoAudit?: boolean;
}

/**
 * Security Score Component
 * SRP: Security score visualization ONLY
 */
const SecurityScoreCard: React.FC<{
    score: number;
    vulnerabilityCount: number;
}> = ({ score, vulnerabilityCount }) => {
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 90) return 'bg-green-50';
        if (score >= 70) return 'bg-yellow-50';
        return 'bg-red-50';
    };

    return (
        <div className={`rounded-lg border p-6 ${getScoreBgColor(score)}`}>
            <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                    <Shield className={`h-8 w-8 ${getScoreColor(score)}`} />
                </div>

                <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
                    {score}/100
                </div>

                <p className="text-sm text-gray-600 mb-4">Security Score</p>

                <div className="flex justify-center gap-4 text-sm">
                    <div className="text-center">
                        <div className="font-semibold text-gray-900">{vulnerabilityCount}</div>
                        <div className="text-gray-500">Issues</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Vulnerability List Component
 * SRP: Vulnerability display ONLY
 */
const VulnerabilityList: React.FC<{
    vulnerabilities: SecurityVulnerability[];
    title: string;
}> = ({ vulnerabilities, title }) => {
    const getSeverityColor = (severity: SecurityVulnerability['severity']) => {
        switch (severity) {
            case 'critical': return 'text-red-600 bg-red-50';
            case 'high': return 'text-orange-600 bg-orange-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-blue-600 bg-blue-50';
        }
    };

    const getSeverityIcon = (severity: SecurityVulnerability['severity']) => {
        switch (severity) {
            case 'critical': return <XCircle className="h-4 w-4" />;
            case 'high': return <AlertTriangle className="h-4 w-4" />;
            case 'medium': return <Clock className="h-4 w-4" />;
            case 'low': return <CheckCircle className="h-4 w-4" />;
        }
    };

    if (vulnerabilities.length === 0) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">No {title} vulnerabilities found</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">{title} ({vulnerabilities.length})</h4>
            {vulnerabilities.map((vuln) => (
                <div key={vuln.id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className={`p-1 rounded ${getSeverityColor(vuln.severity)}`}>
                            {getSeverityIcon(vuln.severity)}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium text-gray-900">{vuln.title}</h5>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                                    {vuln.severity.toUpperCase()}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">{vuln.description}</p>

                            <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                                <p className="text-sm text-blue-700">
                                    <strong>Recommendation:</strong> {vuln.recommendation}
                                </p>
                            </div>

                            {vuln.affectedComponents.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {vuln.affectedComponents.map((component, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                        >
                                            {component}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Compliance Status Component
 * SRP: Compliance status visualization ONLY
 */
const ComplianceStatus: React.FC<{
    complianceChecks: SecurityAuditReport['complianceChecks'];
}> = ({ complianceChecks }) => {
    const complianceItems = [
        { key: 'owasp', label: 'OWASP Top 10', icon: <Shield className="h-4 w-4" /> },
        { key: 'gdpr', label: 'GDPR Compliance', icon: <Database className="h-4 w-4" /> },
        { key: 'inputValidation', label: 'Input Validation', icon: <Key className="h-4 w-4" /> },
        { key: 'authenticationSecurity', label: 'Auth Security', icon: <Lock className="h-4 w-4" /> },
        { key: 'dataEncryption', label: 'Data Encryption', icon: <Settings className="h-4 w-4" /> },
    ] as const;

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {complianceItems.map(({ key, label, icon }) => {
                    const isCompliant = complianceChecks[key];
                    return (
                        <div
                            key={key}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${isCompliant
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                                }`}
                        >
                            <div className={isCompliant ? 'text-green-600' : 'text-red-600'}>
                                {icon}
                            </div>
                            <div>
                                <div className="font-medium text-sm text-gray-900">{label}</div>
                                <div className={`text-xs ${isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                                    {isCompliant ? 'Compliant' : 'Issues Found'}
                                </div>
                            </div>
                            <div className="ml-auto">
                                {isCompliant ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/**
 * Security Checklist Component
 * SRP: Security checklist display ONLY
 */
const SecurityChecklist: React.FC = () => {
    const checklist = SecurityHardeningService.getProductionSecurityChecklist();

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Security Checklist</h3>

            <div className="space-y-4">
                {checklist.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                        <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                        <div className="space-y-2">
                            {category.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center gap-3">
                                    {item.completed ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    )}

                                    <span className={`text-sm ${item.completed ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                                        {item.task}
                                    </span>

                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.priority === 'critical'
                                        ? 'bg-red-100 text-red-700'
                                        : item.priority === 'high'
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {item.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Security Dashboard Main Component
 * SRP: Security dashboard orchestration ONLY
 */
export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
    className = '',
    autoAudit = true,
}) => {
    const [auditReport, setAuditReport] = useState<SecurityAuditReport | null>(null);
    const [isAuditing, setIsAuditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Perform security audit via API
     */
    const performAudit = async () => {
        setIsAuditing(true);
        setError(null);

        try {
            const response = await fetch('/api/security/audit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ forceRefresh: true }),
            });

            if (!response.ok) {
                throw new Error(`Security audit failed: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                setAuditReport(result.data);
            } else {
                throw new Error(result.message || 'Security audit failed');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Security audit failed';
            setError(errorMessage);
            console.error('Security audit error:', error);
        } finally {
            setIsAuditing(false);
        }
    };

    /**
     * Auto-audit on mount if enabled
     */
    useEffect(() => {
        if (autoAudit) {
            performAudit();
        }
    }, [autoAudit]);

    if (error) {
        return (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
                <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Security Audit Error</span>
                </div>
                <p className="text-sm text-red-600 mt-2">{error}</p>
                <button
                    onClick={performAudit}
                    className="mt-3 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                    Retry Audit
                </button>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Security Dashboard</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Security audit results and compliance monitoring
                    </p>
                </div>

                <button
                    onClick={performAudit}
                    disabled={isAuditing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                >
                    <RefreshCw className={`h-4 w-4 ${isAuditing ? 'animate-spin' : ''}`} />
                    {isAuditing ? 'Auditing...' : 'Run Audit'}
                </button>
            </div>

            {/* Security Score */}
            {auditReport && (
                <SecurityScoreCard
                    score={auditReport.score}
                    vulnerabilityCount={auditReport.vulnerabilities.length}
                />
            )}

            {/* Compliance Status */}
            {auditReport && (
                <ComplianceStatus complianceChecks={auditReport.complianceChecks} />
            )}

            {/* Vulnerabilities by Severity */}
            {auditReport && auditReport.vulnerabilities.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Security Vulnerabilities</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <VulnerabilityList
                            vulnerabilities={auditReport.vulnerabilities.filter(v => v.severity === 'critical')}
                            title="Critical Vulnerabilities"
                        />

                        <VulnerabilityList
                            vulnerabilities={auditReport.vulnerabilities.filter(v => v.severity === 'high')}
                            title="High Priority Vulnerabilities"
                        />
                    </div>

                    {auditReport.vulnerabilities.filter(v => v.severity === 'medium' || v.severity === 'low').length > 0 && (
                        <VulnerabilityList
                            vulnerabilities={auditReport.vulnerabilities.filter(v => v.severity === 'medium' || v.severity === 'low')}
                            title="Other Vulnerabilities"
                        />
                    )}
                </div>
            )}

            {/* Security Checklist */}
            <SecurityChecklist />

            {/* Recommendations */}
            {auditReport && auditReport.recommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700 mb-3">
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">Security Recommendations</span>
                    </div>
                    <ul className="space-y-2">
                        {auditReport.recommendations.map((recommendation, index) => (
                            <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                {recommendation}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Audit Status */}
            {!auditReport && !isAuditing && (
                <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Security Audit Not Run</h3>
                    <p className="text-gray-600 mb-4">
                        Click &quot;Run Audit&quot; to perform a comprehensive security assessment
                    </p>
                </div>
            )}

            {/* Last Audit Info */}
            {auditReport && (
                <div className="text-xs text-gray-500 text-center">
                    Last audit: {auditReport.lastAuditDate.toLocaleString()}
                </div>
            )}
        </div>
    );
};
