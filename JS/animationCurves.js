export default {

    linear: function (t) {
        return t;
    },
    easeInQuad: function (t) {
        return t * t;
    },
    easeOutQuad: function (t) {
        return t * (2 - t);
    },
    easeInOutQuad: function (t) {
        if (t < 0.5) return 2 * t * t;
        return -1 + (4 * t) - (4 * t * t);
    },
    easeInCubic: function (t) {
        return t * t * t;
    },
    easeOutCubic: function (t) {
        return (--t) * t * t + 1;
    },
    easeInOutCubic: function (t) {
        if (t < 0.5) return 4 * t * t * t;
        return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function (t) {
        return t * t * t * t;
    },
    easeOutQuart: function (t) {
        return 1 - (--t) * t * t * t;
    },
    easeInOutQuart: function (t) {
        if (t < 0.5) return 8 * t * t * t * t;
        return 1 - 8 * (--t) * t * t * t;
    },

    animate: animate,
}

async function animate(duration, animationCurve, callback) {
    const start = performance.now();

    function step(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const easedProgress = animationCurve(progress);

        callback(easedProgress);

        if (progress < 1) {
            return requestAnimationFrame(step);
        }
    }
    
    return requestAnimationFrame(step);
}