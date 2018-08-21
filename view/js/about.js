window.onload = function () {
    new Vue({
        el: '#app',
        data: {
            my: {
                mytitle: true
            },
            active: 0,
            imgurls: [{ url: "./image/lunbo1.jpg" }, { url: "./image/lunbo2.jpg" }, { url: "./image/lunbo3.jpg" }, { url: "./image/lunbo4.jpg" }, { url: "./image/lunbo5.jpg" }]
        },

        methods: {
            next() {
                if (this.active++ > 2) this.active = 0;
            }
        }

    })

}
