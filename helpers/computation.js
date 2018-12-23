//computes if first date is in range of the second date
module.exports.isInRange = function isInRange(start1, end1, start2, end2){
    start1 = Date.parse(start1);
    end1 = Date.parse(end1);
    start2 = Date.parse(start2);
    end2 = Date.parse(end2);

    return !((start1 > end1 || start2 > end2) || (start1 < start2 || end1 > end2));
};