// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
//
// Project: BasicExam
// Controller: ControllerAbout
// ==========================================================================

BasicExam.ControllerAbout = M.Controller.extend({

    menu_list: [
        {
            value: 'https://www.rac.ca/en/amateur-radio/beginner-info/exhaminer/',
            label: 'Refined Question-Set from ExHAMiner by François Daigneault, VE2AAY'
        },
        {
            value: 'http://www.ic.gc.ca/eic/site/smt-gst.nsf/eng/sf01900.html',
            label: 'ExHAMiner questions based upon RIC-7'
        },
        {
            value: 'http://www.the-m-project.org/',
            label: 'Framework provided by The M Project'
        },
        {
            value: 'http://omnipotent.net/jquery.sparkline/',
            label: 'Graphs provided by jQuery Sparkline'
        },
        {
            value: 'http://rarclub.ca/',
            label: 'Thanks to Richmond Amateur Radio Club for the Beginner\'s course'
        },
        {
            value: 'http://www.disconti.nu/',
            label: 'Put together by Aki Mimoto (amimoto@gmail.com)'
        },
    ],


    init: function(isFirstLoad) {
        this.set('menu_list',this.menu_list);
    },


    ontap_menu: function (id) {
    // --------------------------------------------------
        var menu_rec = M.ViewManager.getView(id, 'name').item;
        url = menu_rec['value'];
        window.location = url;
    },
});
