// Use environment variable if available, otherwise use same origin
// Environment variable is set in .env file: VITE_API_URL
// Falls back to current origin for backward compatibility
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : `${window.location.origin}/api`;


export const api = {
    async register(data) {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });


        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return response.json();
    },

    async login(data) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return response.json();
    },

    async logout(token) {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        return response.json();
    },

    async getUser(token) {
        const response = await fetch(`${API_URL}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        return response.json();
    },

	async get(endpoint){
		const response = await fetch(`${API_URL}/${endpoint}`, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Accept': 'application/json',
			}
		});

		if (!response.ok) {
			const error = await response.json();
			throw error;
		}

		return response.json();
	},

	async post(endpoint, data = {}){
		const hasBody = data && Object.keys(data).length > 0;
		const response = await fetch(`${API_URL}/${endpoint}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Accept': 'application/json',
			},
			body: hasBody ? JSON.stringify(data) : undefined,
		});

		if (!response.ok) {
			const error = await response.json();
			throw error;
		}

		return response.json();
	}
};
