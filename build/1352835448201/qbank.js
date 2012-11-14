QBank = M.Object.extend({});

function pad(num, size) {
// --------------------------------------------------
// FROM: http://stackoverflow.com/questions/2998784
//
    var s = "000000000" + num;
    return s.substr(s.length-size);
}


function randomize_array(array) {
// --------------------------------------------------
// Fisher-Yates list shuffle algorithm.
//
    for (i=array.length-1;i>0;i--) {
        rand_index = Math.floor(Math.random()*(i+1));
        temp = array[i];
        array[i] = array[rand_index];
        array[rand_index] = temp;
    }
    return array;
}

/*******************************************************/
/*******************************************************/

QBank.Q = M.Object.extend({

    section_lookup: {},
    subsection_lookup: {},
    question_lookup: {},
    subsection_questions: {},

    limit: 1.645,

    section_list: function () {
    // --------------------------------------------------
        section_lookup = this.section_lookup;
        section_list = [];
        for (id in section_lookup) {
            section = section_lookup[id];
            section_list.push(section);
        }
        section_list.sort(function(a,b){
            return a['name']<b['name'] ? -1
                 : a['name']>b['name'] ? 1
                 : 0;
        });
        return section_list;
    },


    subsection_list: function (section_id) {
    // --------------------------------------------------
    // Filter by section id if required
    //
        subsection_lookup = this.subsection_lookup;
        subsection_list = [];
        for (id in subsection_lookup) {
            subsection = subsection_lookup[id];
            if ( section_id && section_id != subsection['section'] ) {
                continue;
            }
            subsection_list.push(subsection);
        }
        subsection_list.sort(function(a,b){
            return a['name']<b['name'] ? -1
                 : a['name']>b['name'] ? 1
                 : 0;
        });
        return subsection_list;
    },


    question_list: function (section_id,subsection_id) {
    // --------------------------------------------------
    // Filter by section id or section id if required
    //
        question_lookup = this.question_lookup;
        question_list = [];
        for (id in question_lookup) {
            question = question_lookup[id];
            if ( section_id && section_id != question['section'] )
                continue;
            if ( subsection_id && subsection_id != question['subsection'] )
                continue;

            question_list.push(question);
        }
        question_list.sort(function(a,b){
            return a['name']<b['name'] ? -1
                 : a['name']>b['name'] ? 1
                 : 0;
        });
        return question_list;
    },


    init: function () {
    // --------------------------------------------------
        sect_list = QBank_SectList;
        section_lookup = {};
        for (i=0;i<sect_list.length;i++){
            s = sect_list[i];
            sect = {
                id: s[0],
                name: s[1]+"-"+pad(s[2],3),
                title: s[3]
            };
            section_lookup[s[0]]=sect;
        }
        this.set('section_lookup',section_lookup);

        subsect_list = QBank_SubSectList;
        subsection_lookup = {};
        for (i=0;i<subsect_list.length;i++){
            ss = subsect_list[i];
            s = section_lookup[ss[1]];
            subsect = {
                id: ss[0],
                section: ss[1],
                name: s['name']+'-'+pad(ss[2],2),
                title: ss[3]
            };
            subsection_lookup[ss[0]]=subsect;
        }
        this.set('subsection_lookup',subsection_lookup);

        question_list = QBank_QList;
        question_lookup = {};
        for (i=0;i<question_list.length;i++){
            q = question_list[i];
            ss = subsection_lookup[q[1]];
            quest = {
                id: q[0],
                section: ss['section'],
                subsection: q[1],
                name: ss['name']+'-'+pad(q[2],2),
                question: q[3],
                answer: q[4],
                choices: q[5],
                details: q[6],
            };
            question_lookup[q[0]] = quest;
        }
        this.set('question_lookup',question_lookup);

        // create a list of questions per subsection
        subsect_questions = {};
        for (id in question_lookup) {
            question = question_lookup[id];
            subsect = question['subsection'];
            if (!subsect_questions[subsect])
                subsect_questions[subsect] = [];
            subsect_questions[subsect].push(question['id']);
        }
        this.set('subsection_questions',subsect_questions);
    },


    question_get: function (question_id) {
    // --------------------------------------------------
        return this.question_lookup[question_id];
    },

    weights_calculate: function (answer_log) {
    // --------------------------------------------------
    // How is a question weighted?
    //   1. wrong answer means it'll show up more
    //   2. right answer means it'll show up less
    //   3. unseen questions should show up sooner
    //   4. repeatedly wrong answers increase appearance
    //
    // Give each question a weight, that becomes part of
    // a range?
    //
    //   A correct answer gives an Xn = -1
    //   An incorrect answer gives an Xn = 1
    //
    //   weight = 1.645 + Xn/n^2 + X(n-1)/(n-1)^2 + X(n-2)/(n-2)^2
    //
    //   The denominator determines how quickly the 
    //   effect of old answers decays. Currently we're using
    //   the square of n since sum(1/Xn) to infinity converges
    //   at around 1.645 with always wrong answers.
    //
        subsection_questions = this.subsection_questions;

        // Use the bootstrap to bias which questions
        // will be used
        weights = {};
        if ( answer_log ) {
            answer_log.sort(function(a,b){
                return a.record.ans_date.localeCompare(
                           b.record.ans_date)
            });

            for (i=0;i<answer_log.length;i++) {
                a = answer_log[i];
                a_id = a.record.ans_question_id;
                if (!weights[a_id]) 
                    weights[a_id] = { weight: this.limit, attempts: 0 };
                attempts = ++weights[a_id]['attempts'];
                weights[a_id]['weight'] += 
                      (a.record.ans_correct?-1:1)
                      /
                      (attempts*attempts);
            }
        }

        return weights;
    },

    randomize_section: function (section_id,subsection_id,answer_log) {
    // --------------------------------------------------
        weights = this.weights_calculate(answer_log);
        question_list = this.question_list(section_id,subsection_id);
        question_weights_lookup = {};

        // Sort all the questions into buckets
        for (i=0;i<question_list.length;i++) {
            q = question_list[i];
            weight = 2*this.limit;
            if (weights[q['id']])
                weight = weights[q['id']]['weight'];
            if (!question_weights_lookup[weight])
                question_weights_lookup[weight] = [];
            question_weights_lookup[weight].push(q['id']);
        }

        for (weight in question_weights_lookup) {
            question_weights_lookup[weight] =
                randomize_array(question_weights_lookup[weight]);
        }

        // Then order the buckets?
        question_ids = [];
        while (!jQuery.isEmptyObject(question_weights_lookup)) {
            // Create the buckets for selection
            weight_list = [];
            for (k in question_weights_lookup)
                weight_list.push(k);

            distrib = [];
            running_total = 0;
            for (i=0;i<weight_list.length;i++) {
                weight = weight_list[i];
                increment = weight*question_weights_lookup[weight].length;
                running_total += increment;
                distrib.push(running_total);
            }

            // Select an element
            pick_value = Math.random()*running_total;
            weight = 0;
            for (i=0;i<distrib.length;i++) {
                if (distrib[i]>=pick_value) {
                    weight = weight_list[i];
                    break;
                }
            }

            question_ids.push(question_weights_lookup[weight].shift());

            if ( question_weights_lookup[weight].length == 0 ) {
                delete question_weights_lookup[weight];
            }
        }

        return question_ids;
    },

    exam_generate: function ( answer_log ) {
    // --------------------------------------------------
        // Use the weights to bias which questions
        // will be used
        weights = this.weights_calculate(answer_log);

        // Choose one question from each subsection
        subsection_questions = this.subsection_questions;
        question_ids = [];
        for (k in subsection_questions) {
            sq = subsection_questions[k];
            question_ranges = [];

            // Apply the weights to all the questions
            running_total = 0;
            for (i=0;i<sq.length;i++) {
                a_id = sq[i];
                if ( weights[a_id] )
                    running_total += weights[a_id]['weight'];
                else
                    running_total += this.limit * 2;
                question_ranges.push(running_total);
            }

            // Now choose the question while acknowledging 
            // the weights
            pick_value = Math.random()*running_total;
            question_id = 0;
            for (i=0;i<sq.length;i++) {
                if (question_ranges[i]>=pick_value) {
                    question_id = sq[i];
                    break;
                }
            }

            question_ids.push(question_id);
        }

        // Now, randomize the lot
        question_ids = randomize_array(question_ids);

        return question_ids;
    },

});

QBank.Q.init();

