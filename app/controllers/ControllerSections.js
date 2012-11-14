// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerSections
// ==========================================================================

BasicExam.ControllerSections = M.Controller.extend({

    menu_list: [],

    init: function(isFirstLoad) {
    // --------------------------------------------------
        if ( isFirstLoad ) {
            section_list = QBank.Q.section_list();
            this.set('menu_list',section_list);
        }
    },

    ontap_menu: function (id) {
    // --------------------------------------------------
        var menu_rec = M.ViewManager.getView(id, 'name').item;
        BasicExam.ControllerSubSections.section_id = menu_rec['id'];
        this.switchToPage('page_viewsubsections');
    },

    action_randomize: function () {
    // --------------------------------------------------
        answer_log = BasicExam.ModelAnswers.find();
        question_ids = QBank.Q.randomize_section(null,null,answer_log);
        BasicExam.ControllerQuestion.questions_load(question_ids);
        this.switchToPage('page_viewquestion');

    }


});
