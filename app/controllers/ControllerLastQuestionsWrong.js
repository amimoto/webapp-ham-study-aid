// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
//
// Project: BasicExam
// Controller: ControllerLastQuestionsWrong
// ==========================================================================

BasicExam.ControllerLastQuestionsWrong = M.Controller.extend({

    menu_list: [],

    init: function(isFirstLoad) {
        question_ids = BasicExam.ModelAnswers.last_wrong_answers(50);
        question_list = [];
        for (i=0;i<question_ids.length;i++) {
            question_id = question_ids[i];
            question = QBank.Q.question_lookup[question_id];
            question_list.push(question);
        }
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
