import React from 'react';

interface Activity {
    description: string;
    amount: string;
    type: 'income' | 'expense';
}

interface RecentActivitiesProps {
    activities: Activity[];
}

/**
 * RecentActivities Component
 * 
 * Displays a list of recent financial activities
 * Follows SRP by handling only activities display
 */
export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                    Ultime Attività
                </h2>
            </div>
            <div className="p-6">
                <div className="space-y-3 text-sm">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex justify-between">
                            <span className="text-gray-600">{activity.description}</span>
                            <span className={
                                activity.type === 'income'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }>
                                {activity.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 