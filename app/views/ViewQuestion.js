// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// View: ViewQuestion
// ==========================================================================

BasicExam.ViewQuestion = M.PageView.design({

    events: {
        pagebeforeshow: {
            target: BasicExam.ControllerQuestion,
            action: 'init'
        }
    },
    
    cssClass: 'ViewQuestion',

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        value: 'Questions',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),

    content: M.ScrollView.design({
        childViews: 'label_question '+
                    'selectionlist_answers '+
                    'toggle_actions',

        label_question: M.LabelView.design({
            cssClass: 'label-question',
            contentBinding: {
                target: BasicExam.ControllerQuestion,
                property: 'question_text'
            },
        }),

        selectionlist_answers: M.SelectionListView.design({
            name: 'answer',
            selectionMode: M.SINGLE_SELECTION,
            contentBinding: {
                target: BasicExam.ControllerQuestion,
                property: 'answer_list'
            },
            computedValue: {
                operation: function(v) {
                    return v;
                },
            },
        }),

        toggle_actions: M.ToggleView.design({

            childViews: 'buttongroup_questioning answer_detail',

            buttongroup_questioning: M.ButtonGroupView.design({
                childViews: 'button_task_save button_task_delete',
                cssClass: 'button-action',
                isSelectable: NO,
                button_task_save: M.ButtonView.design({
                    value: 'Show',
                    events: {
                        tap: {
                            target: BasicExam.ControllerQuestion, 
                            action: 'action_show'
                        }
                    },
                }),
                button_task_delete: M.ButtonView.design({
                    value: 'Submit',
                    events: {
                        tap: {
                            target: BasicExam.ControllerQuestion, 
                            action: 'action_submit'
                        }
                    },
                }),
            }),

            answer_detail: M.ScrollView.design({
                childViews: 'label_answer_detail button_task_next',

                label_answer_detail: M.LabelView.design({
                    cssClass: 'label-answer-detail',
                    contentBinding: {
                        target: BasicExam.ControllerQuestion,
                        property: 'answer_detail_text'
                    },
                }),


                button_task_next: M.ButtonView.design({
                    value: 'Next',
                    events: {
                        tap: {
                            target: BasicExam.ControllerQuestion, 
                            action: 'action_next_question'
                        }
                    },
                }),
            }),

        }),




    }),

    footer: M.ToolbarView.design({
        childViews: 'label',
        anchorLocation: M.BOTTOM,

        label: M.LabelView.design({
            anchorLocation: M.CENTER,
            contentBinding: {
                target: BasicExam.ControllerQuestion,
                property: 'footer_text'
            },
        })
    })

});

