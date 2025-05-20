// User authentication and API key management
class UserAuth {
    constructor() {
        this.currentUser = null;
        this.apiKey = localStorage.getItem('userApiKey') || null;
        this.accessibleGrades = new Set();
    }

    setApiKey(key) {
        if (!key) return false;
        this.apiKey = key;
        localStorage.setItem('userApiKey', key);
        return true;
    }

    async validateApiKey() {
        if (!this.apiKey) return false;
        
        // TODO: Replace with your actual API validation endpoint
        // This is a mock validation - implement your actual validation logic
        const validGrades = await this.checkGradeAccess(this.apiKey);
        if (validGrades && validGrades.length > 0) {
            this.accessibleGrades = new Set(validGrades);
            return true;
        }
        return false;
    }

    async checkGradeAccess(apiKey) {
        // Mock API response - replace with actual API call
        // In production, this should call your backend to validate the API key
        // and return the grades the user has access to
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock validation - replace with actual API validation
                if (apiKey && apiKey.length > 8) {
                    if (apiKey.includes('10')) {
                        resolve(['10th']);
                    } else if (apiKey.includes('11')) {
                        resolve(['11th']);
                    } else if (apiKey.includes('all')) {
                        resolve(['10th', '11th']);
                    } else {
                        resolve([]);
                    }
                } else {
                    resolve([]);
                }
            }, 500);
        });
    }

    hasAccessToGrade(grade) {
        return this.accessibleGrades.has(grade);
    }

    getAccessibleGrades() {
        return Array.from(this.accessibleGrades);
    }

    clearAuth() {
        this.apiKey = null;
        this.accessibleGrades.clear();
        localStorage.removeItem('userApiKey');
    }
}

// Initialize auth globally
window.userAuth = new UserAuth();
