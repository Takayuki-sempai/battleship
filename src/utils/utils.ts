export const IdGenerator = (seed?: number) => {
    let currentUserId = seed || 0;
    const getNextId = () => ++currentUserId
    return {getNextId}
}