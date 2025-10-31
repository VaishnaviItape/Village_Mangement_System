export const mapSocialUserToProfile = (user) => {
    if (!user || typeof user !== 'object') {
        throw new Error('Invalid user object');
    }

    const { name, email, photo, contact } = user;

    const capitalizedName = name.split(' ').map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1)).join(' ')

    return {
        name: capitalizedName,
        email,
        contact,
        image: photo,
    };
}
