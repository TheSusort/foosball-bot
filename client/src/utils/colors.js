/**
 * Team color configuration helper for frontend
 * Reads team colors from Vite environment variables with fallbacks
 */

// Color mapping for Tailwind CSS colors (hex values)
export const colorMap = {
    blue: { 500: '#3B82F6', 600: '#1E40AF' },
    red: { 500: '#EF4444', 600: '#B91C1C' },
    green: { 500: '#10B981', 600: '#047857' },
    orange: { 500: '#F97316', 600: '#EA580C' },
    purple: { 500: '#8B5CF6', 600: '#7C3AED' },
    yellow: { 500: '#EAB308', 600: '#CA8A04' },
    pink: { 500: '#EC4899', 600: '#DB2777' },
    indigo: { 500: '#6366F1', 600: '#4F46E5' },
    teal: { 500: '#14B8A6', 600: '#0D9488' },
    cyan: { 500: '#06B6D4', 600: '#0891B2' },
    gray: { 500: '#6B7280', 600: '#4B5563' },
    slate: { 500: '#64748B', 600: '#475569' },
    zinc: { 500: '#71717A', 600: '#52525B' },
    stone: { 500: '#78716C', 600: '#57534E' },
    emerald: { 500: '#10B981', 600: '#047857' },
    lime: { 500: '#84CC16', 600: '#65A30D' },
    amber: { 500: '#F59E0B', 600: '#D97706' },
    rose: { 500: '#F43F5E', 600: '#E11D48' },
    violet: { 500: '#8B5CF6', 600: '#7C3AED' },
    fuchsia: { 500: '#D946EF', 600: '#C026D3' }
};

export const getTeamColors = () => {
    return {
        team1: {
            color: import.meta.env.VITE_TEAM_1_COLOR || "blue",
            name: import.meta.env.VITE_TEAM_1_NAME || "Blues",
            classes: import.meta.env.VITE_TEAM_1_CLASSES || "bg-blue-500 text-white",
        },
        team2: {
            color: import.meta.env.VITE_TEAM_2_COLOR || "red",
            name: import.meta.env.VITE_TEAM_2_NAME || "Reds",
            classes: import.meta.env.VITE_TEAM_2_CLASSES || "bg-red-500 text-white",
        },
    };
};

// Helper function to get gradient style for CurrentMatch
export const getGradientStyle = (colors) => {
    const team1Color = colorMap[colors.team1.color] || colorMap.blue;
    const team2Color = colorMap[colors.team2.color] || colorMap.red;
    
    return {
        backgroundImage: `linear-gradient(130deg, 
            ${team1Color[600]} 0%, 
            ${team1Color[500]} 49.999%, 
            ${team2Color[500]} 50%, 
            ${team2Color[600]} 100%)`
    };
};
