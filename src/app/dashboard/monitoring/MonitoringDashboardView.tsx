/**
 * Monitoring Dashboard View
 * SRP: Monitoring dashboard orchestration and tab management ONLY
 */

'use client';

import React, { useState } from 'react';
import {
    Activity,
    Shield,
    Smartphone,
    Settings,
    BarChart3,
    AlertTriangle
} from 'lucide-react';
import { LazyPerformanceDashboard, LazySecurityDashboard } from '@/components/common/LazyComponents';

type MonitoringTab = 'performance' | 'security' | 'mobile' | 'deployment';

interface MonitoringTabConfig {
    id: MonitoringTab;
    name: string;
    icon: React.ReactNode;
    description: string;
}

/**
 * Mobile UX Dashboard Component (Placeholder)
 * SRP: Mobile UX monitoring ONLY
 */
const MobileUXDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Mobile UX Monitoring</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Mobile user experience metrics and optimization recommendations
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-2 text-blue-700 mb-3">
                    <Smartphone className="h-5 w-5" />
                    <span className="font-medium">Mobile UX Analysis</span>
                </div>
                <div className="space-y-3 text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Touch targets: 98% compliant (44px+ minimum)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Touch response: &lt;16ms average</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Gesture accuracy: 95% success rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <span>Font readability: 85% optimal (consider larger fonts)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>PWA compatibility: 100% ready</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold text-gray-900">Touch Performance</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Response Time</span>
                            <span className="font-medium text-green-600">&lt;16ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Gesture Accuracy</span>
                            <span className="font-medium text-green-600">95%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Touch Targets</span>
                            <span className="font-medium text-green-600">98% OK</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold text-gray-900">Visual Performance</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Font Readability</span>
                            <span className="font-medium text-yellow-600">85%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Color Contrast</span>
                            <span className="font-medium text-green-600">AA</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Layout Stability</span>
                            <span className="font-medium text-green-600">0.02 CLS</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Settings className="h-5 w-5 text-purple-500" />
                        <h3 className="font-semibold text-gray-900">Device Support</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">iOS Support</span>
                            <span className="font-medium text-green-600">✓</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Android Support</span>
                            <span className="font-medium text-green-600">✓</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tablet Support</span>
                            <span className="font-medium text-green-600">✓</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Deployment Readiness Dashboard Component (Placeholder)
 * SRP: Deployment readiness monitoring ONLY
 */
const DeploymentReadinessDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Deployment Readiness</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Production deployment assessment and readiness checklist
                </p>
            </div>

            {/* Overall Readiness Score */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">92/100</div>
                    <p className="text-sm text-gray-600 mb-4">Deployment Readiness Score</p>
                    <div className="flex justify-center gap-4 text-sm">
                        <div className="text-center">
                            <div className="font-semibold text-gray-900">2</div>
                            <div className="text-gray-500">Blockers</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-gray-900">~45min</div>
                            <div className="text-gray-500">Est. Fix Time</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deployment Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold text-gray-900">Performance</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">95/100</div>
                    <p className="text-sm text-gray-600">Ready for deployment</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-semibold text-gray-900">Security</h3>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600 mb-1">85/100</div>
                    <p className="text-sm text-gray-600">Minor improvements needed</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold text-gray-900">Testing</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">90/100</div>
                    <p className="text-sm text-gray-600">Excellent coverage</p>
                </div>
            </div>

            {/* Deployment Blockers */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-700 mb-3">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Deployment Blockers (2)</span>
                </div>
                <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• Environment variables validation needed for production</li>
                    <li>• HTTPS enforcement configuration required</li>
                </ul>
            </div>

            {/* Deployment Checklist */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pre-Deployment Checklist</h3>

                <div className="space-y-3">
                    {[
                        { task: 'Full test suite passing', completed: true },
                        { task: 'Performance budget met', completed: true },
                        { task: 'Security audit completed', completed: false },
                        { task: 'Environment configuration validated', completed: false },
                        { task: 'Database migration ready', completed: true },
                        { task: 'SSL certificates configured', completed: false },
                        { task: 'Monitoring setup complete', completed: true },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            {item.completed ? (
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                            ) : (
                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                            <span className={`text-sm ${item.completed ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                {item.task}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * Monitoring Dashboard View Main Component
 * SRP: Monitoring dashboard orchestration ONLY
 */
export const MonitoringDashboardView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<MonitoringTab>('performance');

    const tabs: MonitoringTabConfig[] = [
        {
            id: 'performance',
            name: 'Performance',
            icon: <Activity className="h-4 w-4" />,
            description: 'Core Web Vitals and performance monitoring',
        },
        {
            id: 'security',
            name: 'Security',
            icon: <Shield className="h-4 w-4" />,
            description: 'Security audit and vulnerability assessment',
        },
        {
            id: 'mobile',
            name: 'Mobile UX',
            icon: <Smartphone className="h-4 w-4" />,
            description: 'Mobile user experience optimization',
        },
        {
            id: 'deployment',
            name: 'Deployment',
            icon: <Settings className="h-4 w-4" />,
            description: 'Production deployment readiness',
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'performance':
                return (
                    <LazyPerformanceDashboard
                        autoCollect={true}
                        showRealTime={true}
                    />
                );

            case 'security':
                return (
                    <LazySecurityDashboard
                        autoAudit={true}
                    />
                );

            case 'mobile':
                return <MobileUXDashboard />;

            case 'deployment':
                return <DeploymentReadinessDashboard />;

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Production Monitoring</h1>
                        <p className="text-gray-600 mt-2">
                            Monitor performance, security, and deployment readiness for production optimization
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                        <Activity className="h-4 w-4" />
                        <span className="text-sm font-medium">System Healthy</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="pb-8">
                {renderTabContent()}
            </div>

            {/* Active Tab Description */}
            <div className="text-center text-sm text-gray-500">
                {tabs.find(tab => tab.id === activeTab)?.description}
            </div>
        </div>
    );
};
