/**
 * Function to get the subdomain from the current page's URL
 * @returns {string|null} - Returns the subdomain if found, otherwise null
 */
export default function getSubdomain() {
    try {
        // Use the window.location.hostname to get the current page's hostname
        const hostname = window.location.hostname;

        if (!hostname) {
            return null; // If there is no hostname, return null
        }

        // Split the hostname into parts
        const parts = hostname.split('.');

        // If the hostname has more than two parts, it's likely a subdomain
        if (parts.length > 2) {

            if (parts[0].toLowerCase() === "www") {
                parts.shift();
            }

            if (parts.length > 2) {
                // Return all parts except the last two as the subdomain
                return parts.slice(0, -1).join('.');
            }
        }

        // If there are two parts or fewer, there is no subdomain
        return null;
    } catch (error) {
        console.error("Error determining subdomain:", error);
        return null; // Return null if there's an error
    }
}