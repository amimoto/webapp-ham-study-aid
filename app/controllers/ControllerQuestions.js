// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerQuestions
// ==========================================================================

BasicExam.ControllerQuestions = M.Controller.extend({

    subsection_id: 0,
    section_id: 0,
    menu_list: [],

    init: function(isFirstLoad) {
    // --------------------------------------------------
        question_list = QBank.Q.question_list(
                            this.section_id,
                            this.subsection_id
                        );
        this.set('menu_list',question_list);
    },

    ontap_menu: function (id) {
    // --------------------------------------------------
        var menu_rec = M.ViewManager.getView(id, 'name').item;

        question_ids = [];
        question_index = 0;
        for (i=0;i<this.menu_list.length;i++) {
            question = this.menu_list[i];
            question_ids.push(question['id']);
            if ( question['id'] == menu_rec['id'] ) {
                question_index = i;
            }
        }
        BasicExam.ControllerQuestion.questions_load(
            question_ids,
            question_index
        );
        this.switchToPage('page_viewquestion');
    },

});
