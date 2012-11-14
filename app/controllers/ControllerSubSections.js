// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerSubSection
// ==========================================================================

BasicExam.ControllerSubSections = M.Controller.extend({

    section_id: 0,
    menu_list: [],

    init: function(isFirstLoad) {
    // --------------------------------------------------
        subsection_list = QBank.Q.subsection_list(this.section_id);
        this.set('menu_list',subsection_list);
    },

    ontap_menu: function (id) {
    // --------------------------------------------------
        var menu_rec = M.ViewManager.getView(id, 'name').item;
        BasicExam.ControllerQuestions.section_id = null;
        BasicExam.ControllerQuestions.subsection_id = menu_rec['id'];
        this.switchToPage('page_viewquestions');
    },

    action_randomize: function () {
    // --------------------------------------------------
        answer_log = BasicExam.ModelAnswers.find();
        question_ids = QBank.Q.randomize_section(this.section_id,null,answer_log);
        BasicExam.ControllerQuestion.questions_load(question_ids);
        this.switchToPage('page_viewquestion');
    }

});
