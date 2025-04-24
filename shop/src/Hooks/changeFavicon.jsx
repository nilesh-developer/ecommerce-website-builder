// Function to change the favicon dynamically
export default function changeFavicon (favicon) {
    if(favicon){
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = favicon;
        document.getElementsByTagName('head')[0].appendChild(link);
    } else {
        return null
    }
};