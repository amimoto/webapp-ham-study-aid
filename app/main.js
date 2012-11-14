// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam 
// ==========================================================================

var BasicExam  = BasicExam || {};

BasicExam.app = M.Application.design({

    entryPage : 'page_viewhome',
    // entryPage : 'page_viewabout',

    page_viewabout: BasicExam.ViewAbout,
    page_viewhome: BasicExam.ViewHome,
    page_viewsections: BasicExam.ViewSections,
    page_viewsubsections: BasicExam.ViewSubSections,
    page_viewquestions: BasicExam.ViewQuestions,
    page_viewquestion: BasicExam.ViewQuestion,

    page_viewlastquestionswrong: BasicExam.ViewLastQuestionsWrong,

    page_viewstatssections: BasicExam.ViewStatsSections,
    page_viewstatssubsections: BasicExam.ViewStatsSubSections,

});
