// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// View: ViewSubSections
// ==========================================================================


BasicExam.ViewSubSectionsItem = M.ListItemView.design({
    childViews: 'name',
    isSelectable: NO,
    name: M.LabelView.design({
        name: '',
        valuePattern:   '<div class="list-menu-entry">'
                      +   '<div>'
                      +     '<div class="list-menu-entry-label">'
                      +       '<%= name%> - <%= title%>'
                      +     '</div>'
                      +   '</div>'
                      + '</div>'
    }),
    events: {
        tap: {
            target: BasicExam.ControllerSubSections,
            action:'ontap_menu'
        }
    },
});


BasicExam.ViewSubSections = M.PageView.design({

    events: {
        pageshow: {
            target: BasicExam.ControllerSubSections,
            action: 'init'
        }
    },
    
    cssClass: 'ViewSubSections',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Subsections',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),

    content: M.ScrollView.design({
        childViews: 'label_subsections '+
                    'button_random '+
                    'selectionlist_subsections',
        label_subsections: M.LabelView.design({
            cssClass: 'label-subsections',
            value: 'Select Subsection to Browse'
        }),

        button_random: M.ButtonView.design({
            value: 'Randomize Section Questions',
            events: {
                tap: {
                    target: BasicExam.ControllerSubSections, 
                    action: 'action_randomize'
                }
            },
        }),

        selectionlist_subsections: M.ListView.design({
            listItemTemplateView: BasicExam.ViewSubSectionsItem,
            cssClass: 'list-menu',
            contentBinding: {
                target: BasicExam.ControllerSubSections,
                property: 'menu_list'
            },
        }),

    }),

});

