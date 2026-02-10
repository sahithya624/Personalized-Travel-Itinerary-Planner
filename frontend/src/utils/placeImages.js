/**
 * Get a relevant image for any destination.
 * Uses a combination of curated images for popular destinations
 * and dynamic Unsplash API for any other destination.
 */

// Curated high-quality images for popular destinations
const curatedImages = {
    // India - with ", India" suffix for exact matches
    'Goa, India': 'https://images.unsplash.com/photo-1512789674581-862f3a42b130?auto=format&fit=crop&w=800&q=80',
    'Jaipur, India': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    'Leh Ladakh, India': 'https://images.unsplash.com/photo-1581791534721-e599df440811?auto=format&fit=crop&w=800&q=80',
    'Manali, India': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    'Mumbai, India': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80',
    'Varanasi, India': 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=800&q=80',
    'Udaipur, India': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    'Delhi, India': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    'Bengaluru, India': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    'Kerala (Munnar), India': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    'Rishikesh, India': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',

    // India - without suffix for backward compatibility
    'Goa': 'https://images.unsplash.com/photo-1512789674581-862f3a42b130?auto=format&fit=crop&w=800&q=80',
    'Jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    'Leh Ladakh': 'https://images.unsplash.com/photo-1581791534721-e599df440811?auto=format&fit=crop&w=800&q=80',
    'Ladakh': 'https://images.unsplash.com/photo-1581791534721-e599df440811?auto=format&fit=crop&w=800&q=80',
    'Leh': 'https://images.unsplash.com/photo-1581791534721-e599df440811?auto=format&fit=crop&w=800&q=80',
    'Manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    'Mumbai': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80',
    'Varanasi': 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=800&q=80',
    'Udaipur': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    'New Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    'Bengaluru': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    'Bangalore': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    'Munnar': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    'Rishikesh': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    'Kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    'Agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    'Shimla': 'https://images.unsplash.com/photo-1597074866923-dc0589150f80?auto=format&fit=crop&w=800&q=80',
    'Darjeeling': 'https://images.unsplash.com/photo-1544634076-a90160ddf44d?auto=format&fit=crop&w=800&q=80',
    'Kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
    'Chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    'Hyderabad': 'https://images.unsplash.com/photo-1600850056064-a8b1c9e09e76?auto=format&fit=crop&w=800&q=80',
    'Pune': 'https://images.unsplash.com/photo-1572782252655-9c8771392601?auto=format&fit=crop&w=800&q=80',
    'Amritsar': 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
    'Ooty': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    'Coorg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    'Andaman': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'Jaisalmer': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    'Pushkar': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    'Hampi': 'https://images.unsplash.com/photo-1600100397608-e1917a4a3866?auto=format&fit=crop&w=800&q=80',
    'Mysore': 'https://images.unsplash.com/photo-1600320844562-b0457fffb218?auto=format&fit=crop&w=800&q=80',
    'Kochi': 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80',
    'Alleppey': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    'Pondicherry': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    'Srinagar': 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    'Kashmir': 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',

    // International
    'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    'Kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    'Swiss Alps': 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=800&q=80',
    'Switzerland': 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=800&q=80',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e3e9?auto=format&fit=crop&w=800&q=80',
    'New York City': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e3e9?auto=format&fit=crop&w=800&q=80',
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    'Ibiza': 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80',
    'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-e94e270b2d42?auto=format&fit=crop&w=800&q=80',
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579c5d?auto=format&fit=crop&w=800&q=80',
    'Maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80',
    'Barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
    'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    'Venice': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80',
    'Prague': 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80',
    'Istanbul': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    'Phuket': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
    'Hong Kong': 'https://images.unsplash.com/photo-1536599018102-9f803c490f2e?auto=format&fit=crop&w=800&q=80',
    'Cairo': 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=800&q=80',
    'Machu Picchu': 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80',
    'Peru': 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80',
    'Cancun': 'https://images.unsplash.com/photo-1552074284-5e84e62b59c4?auto=format&fit=crop&w=800&q=80',
    'Mexico': 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=800&q=80',
    'Greece': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    'Hawaii': 'https://images.unsplash.com/photo-1507876466758-bc54f384809c?auto=format&fit=crop&w=800&q=80',
    'Mauritius': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
    'Seychelles': 'https://images.unsplash.com/photo-1589979481223-deb893043163?auto=format&fit=crop&w=800&q=80',
    'Fiji': 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
    'Morocco': 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
    'Marrakech': 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80',
    'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
    'South Africa': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
    'Vietnam': 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=800&q=80',
    'Hanoi': 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=800&q=80',
    'Seoul': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80',
    'South Korea': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80',
    'Australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    'New Zealand': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    'Canada': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&q=80',
    'Iceland': 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=800&q=80',
    'Norway': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80',
    'Finland': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80',
    'Sweden': 'https://images.unsplash.com/photo-1508189860359-777d945909ef?auto=format&fit=crop&w=800&q=80',
    'Austria': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80',
    'Vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80',
    'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80',
    'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
    'Spain': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
    'Italy': 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?auto=format&fit=crop&w=800&q=80',
    'France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    'UK': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    'England': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    'Japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    'China': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&q=80',
    'Beijing': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&q=80',
    'Shanghai': 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=800&q=80',
    'Malaysia': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    'Kuala Lumpur': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    'Indonesia': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    'Jakarta': 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=800&q=80',
    'Philippines': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    'Thailand': 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
    'Nepal': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    'Kathmandu': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    'Sri Lanka': 'https://images.unsplash.com/photo-1586185133400-69f2e15d8ed8?auto=format&fit=crop&w=800&q=80',
    'Colombo': 'https://images.unsplash.com/photo-1586185133400-69f2e15d8ed8?auto=format&fit=crop&w=800&q=80',
    'Bhutan': 'https://images.unsplash.com/photo-1553856622-d1b352e9a211?auto=format&fit=crop&w=800&q=80',
    'Tibet': 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80',
    'Russia': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80',
    'Moscow': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80',
    'Brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
    'Rio de Janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
    'Argentina': 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&w=800&q=80',
    'Buenos Aires': 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&w=800&q=80',
    'Chile': 'https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1?auto=format&fit=crop&w=800&q=80',
    'Colombia': 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80',
    'Costa Rica': 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=800&q=80',
    'Cuba': 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?auto=format&fit=crop&w=800&q=80',
    'Havana': 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?auto=format&fit=crop&w=800&q=80',
    'Egypt': 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=800&q=80',
    'Kenya': 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=800&q=80',
    'Tanzania': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    'Uganda': 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80',
    'Zanzibar': 'https://images.unsplash.com/photo-1580746738099-070cbb0c6d55?auto=format&fit=crop&w=800&q=80',
};

// Reliable fallback travel images for destinations not in the curated list
const fallbackTravelImages = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?auto=format&fit=crop&w=800&q=80',
];

/**
 * Simple hash function to deterministically pick a fallback image based on destination name
 */
const getHashIndex = (str, arrayLength) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % arrayLength;
};

/**
 * Get image URL for a destination
 * First tries to find a curated image, then falls back to reliable stock images
 * @param {string} destination - The destination name
 * @returns {string} - URL of the image
 */
export const getPlaceImage = (destination) => {
    if (!destination) {
        return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
    }

    const destinationLower = destination.toLowerCase().trim();

    // Try exact match first
    const exactMatch = Object.keys(curatedImages).find(
        key => key.toLowerCase() === destinationLower
    );
    if (exactMatch) {
        return curatedImages[exactMatch];
    }

    // Try partial match (destination contains key or key contains destination)
    const partialMatch = Object.keys(curatedImages).find(key => {
        const keyLower = key.toLowerCase();
        return destinationLower.includes(keyLower) || keyLower.includes(destinationLower);
    });
    if (partialMatch) {
        return curatedImages[partialMatch];
    }

    // Use a deterministic fallback image instead of deprecated source.unsplash.com
    return fallbackTravelImages[getHashIndex(destinationLower, fallbackTravelImages.length)];
};

/**
 * Get a hero/banner sized image for a destination
 * @param {string} destination - The destination name
 * @returns {string} - URL of the larger image
 */
export const getPlaceHeroImage = (destination) => {
    if (!destination) {
        return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
    }

    const destinationLower = destination.toLowerCase().trim();

    // Try exact match first
    const exactMatch = Object.keys(curatedImages).find(
        key => key.toLowerCase() === destinationLower
    );
    if (exactMatch) {
        const url = curatedImages[exactMatch].replace('w=800', 'w=1600');
        console.log(`[getPlaceHeroImage] Exact match for "${destination}": ${url}`);
        return url;
    }

    // Try partial match
    const partialMatch = Object.keys(curatedImages).find(key => {
        const keyLower = key.toLowerCase();
        return destinationLower.includes(keyLower) || keyLower.includes(destinationLower);
    });
    if (partialMatch) {
        const url = curatedImages[partialMatch].replace('w=800', 'w=1600');
        console.log(`[getPlaceHeroImage] Partial match for "${destination}": ${url}`);
        return url;
    }

    // Use a deterministic fallback image instead of deprecated source.unsplash.com
    const fallback = fallbackTravelImages[getHashIndex(destinationLower, fallbackTravelImages.length)];
    const url = fallback.replace('w=800', 'w=1600');
    console.log(`[getPlaceHeroImage] Fallback for "${destination}": ${url}`);
    return url;
};

/**
 * Get multiple images for a destination (useful for galleries)
 * @param {string} destination - The destination name  
 * @param {number} count - Number of images to return
 * @returns {string[]} - Array of image URLs
 */
export const getPlaceImageGallery = (destination, count = 4) => {
    if (!destination) {
        return Array(count).fill('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80');
    }

    const searchTerms = [
        `${destination} landmark`,
        `${destination} street`,
        `${destination} food`,
        `${destination} nature`,
        `${destination} culture`,
        `${destination} architecture`
    ];

    return searchTerms.slice(0, count).map((term, i) => {
        const idx = (getHashIndex(destination.toLowerCase(), fallbackTravelImages.length) + i) % fallbackTravelImages.length;
        return fallbackTravelImages[idx];
    });
};
