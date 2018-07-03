module.exports = {
    getMonthName: function(month) {
        switch(month) {
            case 1 : return 'Jan';
            case 2 : return 'Feb';
            case 3 : return 'Mar';
            case 4 : return 'Apr';
            case 5 : return 'May';
            case 6 : return 'Jun';
            case 7 : return 'Jul';
            case 8 : return 'Aug';
            case 9 : return 'Sep';
            case 10 : return 'Oct';
            case 11 : return 'Nov';
            case 12 : return 'Dec';
        }
    },

    formatDate: function(dateString) {
        let dateObj = new Date(dateString);
        let date = dateObj.getDate();
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getFullYear();

        return date+"-"+this.getMonthName(month)+"-"+year;
    }
};
