export const getPlaceImage = (destination) => {
    const images = {
        'Goa': 'https://images.unsplash.com/photo-1512789674581-862f3a42b130?auto=format&fit=crop&w=800&q=80',
        'Jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        'Leh Ladakh': 'https://images.unsplash.com/photo-1581791534721-e599df440811?auto=format&fit=crop&w=800&q=80',
        'Manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        'Mumbai': 'https://images.unsplash.com/photo-1570160897040-fb42eaddf4ec?auto=format&fit=crop&w=800&q=80',
        'Varanasi': 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=800&q=80',
        'Udaipur': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
        'Bengaluru': 'https://images.unsplash.com/photo-1596402184320-417d717867cd?auto=format&fit=crop&w=800&q=80',
        'Munnar': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
        'Rishikesh': 'https://images.unsplash.com/photo-1588693951525-6b79732777f9?auto=format&fit=crop&w=800&q=80',
        'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        'Kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        'Swiss Alps': 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=800&q=80',
        'New York City': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e3e9?auto=format&fit=crop&w=800&q=80',
        'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        'Ibiza': 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80',
        'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        'Tokyo': 'https://images.unsplash.com/photo-1540959733332-e94e270b2d42?auto=format&fit=crop&w=800&q=80',
        'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    }

    // Exact match or fuzzy matching
    const match = Object.keys(images).find(key =>
        destination.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(destination.toLowerCase())
    )

    return images[match] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'; // Default travel image
}
