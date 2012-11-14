// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerStatsSections
// ==========================================================================

BasicExam.ControllerStatsSections = M.Controller.extend({

    section_list: [],

    init: function(isFirstLoad) {
    // --------------------------------------------------
        section_list = BasicExam.ModelAnswers.score_breakdown_by_section();
        this.set('section_list',section_list);

        $('.list-menu-entry-bullet-graph').sparkline(
          'html', 
          {
            type: 'bullet',
          }
        );
    },

    ontap_menu: function (id) {
    // --------------------------------------------------
    },

});
