const calculateRotation = (prevLat: number, prevLng: number, newLat: number, newLng: number) => {
    const deltaX = newLng - prevLng;
    const deltaY = newLat - prevLat;
    let angle = Math.atan2(deltaX, deltaY) * (180 / Math.PI) 
    angle = (angle + 360) % 360;
    return angle;
}

export default calculateRotation;