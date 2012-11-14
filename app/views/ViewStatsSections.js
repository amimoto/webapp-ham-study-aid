// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// View: ViewStatsSections
// ==========================================================================

BasicExam.ViewStatsSectionsItem = M.ListItemView.design({
    childViews: 'name',
    isSelectable: NO,
    name: M.LabelView.design({
        name: '',
        valuePattern: '<div class="list-menu-entry">'
                    +   '<div>'
                    +     '<div class="list-menu-entry-label">'
                    +       '<%= section_name%> '
                    +       '<span class="list-menu-entry-bullet-graph" '
                    +              'values="<%= correct%>,<%= seen%>,<%= questions%>" '
                    +              '>'
                    +         'Loading..'
                    +       '</span>'
                    +       ' <%= correct%>/<%= seen%> of <%= questions%> - <%= score%>%'
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


BasicExam.ViewStatsSections = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: BasicExam.ControllerStatsSections, 
            action: 'init'
        }
    },
    
    cssClass: 'ViewStatsSections',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Subsections',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),

    content: M.ScrollView.design({
        childViews: 'label_statsections '+
                    // 'button_weighted '+
                    'selectionlist_sections',

        label_statsections: M.LabelView.design({
            cssClass: 'label-sections',
            value: 'Select Subsection to Browse'
        }),

        button_weighted: M.ButtonView.design({
            value: 'Randomize Section Questions',
            events: {
                tap: {
                    target: BasicExam.ControllerStatsSections, 
                    action: 'action_randomize'
                }
            },
        }),

        selectionlist_sections: M.ListView.design({
            listItemTemplateView: BasicExam.ViewStatsSectionsItem,
            cssClass: 'list-menu',
            contentBinding: {
                target: BasicExam.ControllerStatsSections,
                property: 'section_list'
            },
        }),

    }),

});

