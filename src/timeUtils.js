export const timeSetting = (dateTime) => {
    const dateToCompare = new Date(dateTime);
    const currentDate = new Date();
    const defTime = currentDate - dateToCompare;
    const days = Math.floor(defTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((defTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((defTime % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days}일 전`;
    } else if (hours > 0) {
        return `약 ${hours}시간 전`;
    } else if (minutes > 0) {
        return `${minutes}분 전`;
    } else {
        return "방금";
    }
};
