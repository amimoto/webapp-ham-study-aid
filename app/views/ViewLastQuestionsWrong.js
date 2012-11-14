// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
//
// Project: BasicExam
// View: ViewLastLastQuestionsWrongWrong
// ==========================================================================


BasicExam.ViewLastQuestionsWrongItem = M.ListItemView.design({
    childViews: 'name',
    isSelectable: NO,
    name: M.LabelView.design({
        name: '',
        valuePattern:   '<div class="list-menu-entry">'
                      +   '<div>'
                      +     '<div class="list-menu-entry-label">'
                      +       '<%= name%> - <%= question%>'
                      +     '</div>'
                      +   '</div>'
                      + '</div>'
    }),
    events: {
        tap: {
            target: BasicExam.ControllerLastQuestionsWrong,
            action:'ontap_menu'
        }
    },
});


BasicExam.ViewLastQuestionsWrong = M.PageView.design({

    events: {
        pageshow: {
            target: BasicExam.ControllerLastQuestionsWrong,
            action: 'init'
        }
    },
    
    cssClass: 'ViewLastQuestionsWrong',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Last 50 Questions Wrong',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),

    content: M.ScrollView.design({
        childViews: 'label_questionss '+
                    'selectionlist_questionss',
        label_questionss: M.LabelView.design({
            cssClass: 'label-questions',
            value: 'Last 50 Wrong Answers',
        }),
        selectionlist_questionss: M.ListView.design({
            listItemTemplateView: BasicExam.ViewLastQuestionsWrongItem,
            cssClass: 'list-menu',
            contentBinding: {
                target: BasicExam.ControllerLastQuestionsWrong,
                property: 'menu_list'
            },
        }),
    }),

});

