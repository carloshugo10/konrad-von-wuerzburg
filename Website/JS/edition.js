﻿$(document).ready(function () {

    $('.form-control').prop('selectedIndex', 0);
    //Resets the text selectors to None
    
    
    /*    VARIABLES*/
    var font_size = 20;
    var columnsNum = 3; //change number of columns
    var guide_ms = $("option[value*='krit']").first().attr("label");
    var extensiveEdition = false;
    var groupScroll = true;
    var scrollController =[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // to move all scrolls at the same time, see scroll function
    var automaticScrolling = false; //to change when using the automatic click scrolling, to avoid conflict with user scroll events
    var counter = 0;
    
    // this variable keeps track of the visualization options for each column from 0 to 11
    var columns_master = []
    for (i=0; i < 12; i++){
        columns_master.push({'pc':true,'expan': false, 'del': true, 'add': true, 'hi': true,'normal': false});
    };
                                            
    /*    END VARIABLES*/
    
    /*FUNCTIONS*/
    
    //This function shows only the spans with the appropiate language. Example: class = "lang" lang="en"
    function languageCheck(language) {
        $(".lang").addClass("hidden");
        $("[lang='" + language + "']").removeClass("hidden");
    };
    //This function changes the language for the selectors
    function languageSelector(language) {
        if (language == "en") {
            $("option[value ='default']").text("Select text");
            $("option[value*='_ct_']").each(function(){
                guide_ms = $(this).text().split("-").pop();
                $(this).text("Critical Text - " + guide_ms);
            });
            $("option[value*='_app']").text("Critical Apparatus");
            $("option[value='references.html']").text("Symbols");
            $("option[value='wit_list']").text("List of Witnesses");
            $("optgroup:nth-of-type(1)").attr("label", "Critical Edition");
            $("optgroup:nth-of-type(2)").attr("label", "Transcriptions");
            $("optgroup:nth-of-type(3)").attr("label", "References");
        }
        if (language == "de") {
            $("option[value ='default']").text("Textauswählen");
            $("option[value*='_ct_']").each(function(){
                guide_ms = $(this).text().split("-").pop();
                $(this).text("Kritischer Text - " + guide_ms);
            });
            $("option[value*='_app']").text("Kritischer Apparat");
            $("option[value='references.html']").text("Symbole");
            $("option[value='wit_list']").text("Zeugnisliste");
            $("optgroup:nth-of-type(1)").attr("label", "Kritische Edition");
            $("optgroup:nth-of-type(2)").attr("label", "Transkriptionen");
            $("optgroup:nth-of-type(3)").attr("label", "Referenzen");
        }
        if (language == "es") {
            $("option[value ='default']").text("Seleccionar Texto");
            $("option[value*='_ct_']").each(function(){
                guide_ms = $(this).text().split("-").pop();
                $(this).text("Texto Crítico - " + guide_ms);
            });
            $("option[value*='_app']").text("Aparato crítico");
            $("option[value='references.html']").text("Símbolos");
            $("option[value='wit_list']").text("Lista de testimonios");
            $("optgroup:nth-of-type(1)").attr("label", "Edición Crítica");
            $("optgroup:nth-of-type(2)").attr("label", "Transcripciones");
            $("optgroup:nth-of-type(3)").attr("label", "Referencias");
        }
    };
    
    //This function sets the number of columns
    function columns(numcolumns) {
        width = 12 / numcolumns;
        $(".text-title").each(function (index) {
            // Text selectors
            if (index + 1 > numcolumns) {
                $(this).addClass("hidden")
            }
            if (index + 1 <= numcolumns) {
                $(this).removeClass();
                $(this).addClass("text-title")
                $(this).addClass("col-md-" + width);
            }
        });
        $(".edition-text").each(function (index) {
            // The texts columns themselves
            $(this).removeClass();
            $(this).addClass("edition-text");
            $(this).addClass("col-md-" + width);
            if (index + 1 > numcolumns) {
                $(this).addClass("hidden");
            }
        });
    };
    // For the visualization
    function visual_on(column, input_name){
        element = "span.tei_" + input_name;
        column.find(element).removeClass("hidden");
    };
    function visual_off(column, input_name){
        element = "span.tei_" + input_name;
        column.find(element).addClass("hidden");
    };
    
    /*   END FUNCTIONS */
    
    /*    TITLE SIZES*/
    var titleHeight = $('#title').height();
    $("#text-titles-nav").css("top", titleHeight);
    var textTitlesNavHeight = $("#text-titles-nav").height();
    $("body").css("paddingTop", titleHeight + textTitlesNavHeight + 5)
    var viewportHeight = $(window).height();
    var textContainerHeight = viewportHeight - titleHeight - textTitlesNavHeight;
    $(".text-container").height(textContainerHeight);
    
    
    /*    disable extensive edition*/
    $("#extensive-edition-toggle").prop('checked', false);
    
    /* set number of columns for selectors and text, and then hide text ones so that the instructions are visible */
    columns(columnsNum);
    $(".edition-text").addClass("hidden");
    
    /*    Form Control - Text Selector appearence*/
    $(".form-control").addClass("form-control-initial");
    $(".form-control").hover(
    function () {
        $(this).removeClass("form-control-initial");
        $(this).addClass("hover");
    },
    function () {
        $(this).removeClass("hover");
        $(this).addClass("form-control-initial");
    });
    
    /*    LANGUAGE CHECK*/
    languageCheck(language);
    languageSelector(language);
    
    
    
    /*  COLUMNS TO DISPLAY*/
    $("input[name=number-cols]").change(function () {
        numcolumns = parseInt($(this).val());
        columns(numcolumns);
    });
    
    
    /* GLOBAL OPTIONS*/
    $("#extensive-edition-toggle").change(function () {
        if (extensiveEdition === false) {
            //extensive edition turns on
            $(".toHide").removeClass("hidden");
            // removes the hidden empty verses
            extensiveEdition = true;
        } else {
            //extensive edition turns off
            $(".toHide").addClass("hidden");
            $(".highlight").removeClass("hidden");
            extensiveEdition = false;
        };
    });
    //group scrollin
    $("#group-scroll").change(function () {
        if (groupScroll === false) {
            groupScroll = true;
        } else {
            groupScroll = false;
        };
    });
    
    
    /*    LOAD TEXTS*/
    $(".form-control-text").change(function () {
        counter = counter + 1;
        if (counter == 1) {
            $("#row_introduction").addClass("hidden");
            columns(columnsNum);
        };
        
        var columnToChange = ($(this).parents(".text-title")).index();
        // index of the column starting at 0
        var columnObject = $(".text-container").filter(function () {
        // the actual JQuery object for the column to change
            return $(this).parents(".edition-text").index() == columnToChange;
        });
        columnObject.empty();
        
        textToLoad = $(this).val();
/*        save in the columns_master array the information of the new text*/
        columns_master[columnToChange]['text'] = textToLoad;
        if (textToLoad == "references.html"){
            columnObject.load('HTML_TEXTS/references.html', function(){languageCheck(language); $(".text-container").css("font-size", font_size+"px");});
        }
        else if(textToLoad == "wit_list"){
            columnObject.load('HTML_TEXTS/list_wit_'+maere+'.html', function(){languageCheck(language); $(".text-container").css("font-size", font_size+"px");});
        }
        
        else{
            if (columns_master[columnToChange]['normal'] == false){
            columnObject.load('HTML_TEXTS/'+textToLoad+'_orig.html', function(){$(".text-container").find("td").css("font-size", font_size+"px");});    
        }else{
            columnObject.load('HTML_TEXTS/'+textToLoad+'_reg.html', function(){$(".text-container").find("td").css("font-size", font_size+"px");});
        };

        

        
        /*        To highlight the corresponding verses and move the scroll*/
        if ($("tr.highlight").length) {
            //check if there are already selected verses
            var counterStop = 0; // this will help to avoid infite loops of the function setInterval
            automaticScrolling = true; // to avoid weird scrolling
            var verse = $("tr.highlight").first();
            var verseNum = verse.children("td.line_number").children("span.corresp_line").text();
            var verseNumDigit = verseNum.substring(1);
            //The verse has an "s", it needs to be removed to be able to function as digit latter.
            var scrollToPrev = setInterval(function () {
                //Function to highlight, scroll and render text according to options
                counterStop = counterStop + 1;
                if (counterStop > 35) {
                    //stops function if it takes too long
                    clearInterval(scrollToPrev);
                };
                if (columnObject.children('table tbody tr:nth-child(' + verseNumDigit + ')')) {
                    //checks if the column already has a children in the place were the highlighted verse is, an indication that the DOM has finished loading
                    var correspRow = $(".edition-text").filter(function () {
                        //the row that needs to be highlighted and scrolled to
                        return $(this).index() == columnToChange
                    }).find("span.corresp_line").filter(function () {
                        return $(this).text() == verseNum
                    }).parents("tr");
                    if (typeof correspRow[0] != 'undefined') {
                        // if, for some reason the DOM has not finished loading and the row is seen as "undefined", then the function will end and start over. If not, the row will be highlighted and scrolled to and then the function will be over.
                        if (extensiveEdition === true) {
                            $(".toHide").removeClass("hidden")
                        };
                      
                        /*      Scrolling                  */
                        correspRow.addClass("highlight");
                        var offsetFinal = verse.offset().top;
                        var offsetInitial = correspRow.offset().top;
                        var newScroll = offsetInitial - offsetFinal;
                        columnObject.scrollTop(newScroll);
                        scrollController[columnToChange] = newScroll;
                        // ends the function
                        clearInterval(scrollToPrev);
                    };
                };
            },
            100);
        };





        // Visualize correctly according to selection
        var visualize = setTimeout(function(){
            for (var key in columns_master[columnToChange]){
                if (columns_master[columnToChange][key] == true){
                    visual_on(columnObject,key);
                } 
                else {
                    visual_off(columnObject,key)
                }
            };
        },500);

        };
        



        
        (this).blur();
    });
    
    /*CLICKING ON VERSES*/
    $('.text-container').on('click', 'td.verse', function () {
        automaticScrolling = true; //to avoid conflict with SCROLLING function
        verse = $(this).parent().children('td.line_number').children('span.corresp_line').text();
        // var verse stores the verse number (in the abstract edition), to be able to compare.
        correspVerses = $("tr").filter(function () {
            return $(this).children("td.line_number").find("span.corresp_line").text() == verse
        });
        // The verses with the same number in other witnesses
        //Remove highlight all verses with the same verse number and hide empty verses if the extensive edition is off
        $("tr").removeClass("highlight");
        if (extensiveEdition == false) {
            $(".toHide").addClass("hidden")
        };
        //calculate offsets and scrolls to align all witnesses and add highlight
        offsetFinal = $(this).offset().top;
        correspVerses.each(function () {
            $(this).removeClass("hidden");
            $(this).addClass("highlight");
            offsetInit = $(this).offset().top;
            scrollOrig = $(this).parents("div.text-container").scrollTop();
            scrollFinal = offsetInit + scrollOrig - offsetFinal;
            $(this).parents("div.text-container").scrollTop(scrollFinal);
            index = $(this).parents("div.edition-text").index();
            //add the new scroll to the variable
            scrollController[index] = scrollFinal;
        });
    });
    
    /*CLICKING ON LINE-NUMBER / APPARATUS CRITICUS NEW WINDOW*/
    $('.text-container').on('click', 'td.line_number', function () {
        var clicked_line_num = $(this).children("span.edit_line").text();
        window.open('traviz_window.php?maere=' + maere +'&line=' + clicked_line_num, '', 'height=400,width=1200, scrollbars=yes');
    });
    
    /*    PRESSING UP-DOWN KEY*/
    $(document).keydown(function (e) {
        automaticScrolling = true; //to avoid conflict with SCROLLING function
        switch (e.which) {
            case 38: //up
            { $(".text-container").not(".paratext").has("table").each(function () {
                    curScroll = $(this).scrollTop();
                    $(this).scrollTop(curScroll - 40);
                });
                break
            };
            case 40: //down
            { $(".text-container").not(".paratext").has("table").each(function () {
                    curScroll = $(this).scrollTop();
                    $(this).scrollTop(curScroll + 40);
                });
                break
            };
        }
        /*e.preventDefault();*/
        automaticScrolling = false; //to avoid conflict with SCROLLING function
    });
    
    /*    HOVER ON VERSE*/
    $(".text-container").on("mouseover", "td.verse", function () {
        verseNum = $(this).prev("td.line_number").children("span.corresp_line").text();
        correspVerses = $("tr").filter(function () {
            return $(this).children("td.line_number").children("span.corresp_line").text() == verseNum
        });
        correspVerses.addClass("highlight-hover");
    });
    $(".text-container").on("mouseleave", "td.verse", function () {
        verseNum = $(this).prev("td.line_number").children("span.corresp_line").text();
        correspVerses = $("tr").filter(function () {
            return $(this).children("td.line_number").children("span.corresp_line").text() == verseNum
        });
        correspVerses.removeClass("highlight-hover");
    });
    
    /*    SCROLLING*/
    $(".text-container").on("scroll", function (event) {
        if (automaticScrolling === true) {
            automaticScrolling = false
        } else {
            index = $(this).parent(".edition-text").index();
            newScroll = $(this).scrollTop();
            if (groupScroll === true) {
                originalScroll = scrollController[index];
                distance = newScroll - originalScroll;
                $(".text-container").not(event.target).each(function () {
                    if ($(this).is(":parent")) {
                        ind = $(this).parent(".edition-text").index();
                        origScroll = scrollController[ind];
                        finalScroll = origScroll + distance;
                        $(this).scrollTop(finalScroll);
                        scrollController[ind] = finalScroll;
                    };
                });
            };
            scrollController[index] = newScroll;
        };
    })
    
    /*    OPTIONS*/
    
    /*    Global Options Change and trigger all witnesses to change*/
    $("input[name^=global]").change(function () {
        var selectedInput = $(this).attr("name").substring(7);
        if (selectedInput == "numerierung") {
            if ($(this).val() == "manuscript") {
                $("span.ms_line").removeClass("hidden");
                $("span.edit_line").addClass("hidden");
                $("span.corresp_line").addClass("hidden");
            }
            if ($(this).val() == "edition") {
                $("span.ms_line").addClass("hidden");
                $("span.edit_line").removeClass("hidden");
                $("span.corresp_line").addClass("hidden");
            } else if ($(this).val() == "alt_ed") {
                $("span.ms_line").addClass("hidden");
                $("span.edit_line").addClass("hidden");
                $("span.corresp_line").removeClass("hidden");
            }
        } else {
            if ($(this).is(":checked")) {
                $("input[name=" + selectedInput + "]").prop("checked", false);
                $("input[name=" + selectedInput + "]").trigger("click");
            } else {
                $("input[name=" + selectedInput + "]").prop("checked", true);
                $("input[name=" + selectedInput + "]").trigger("click");
            };
        };
    });
    
        /*    OPTION LANGUAGE*/
    
    $("input[name=language-selector]").click(function(){
        language = $(this).attr("value");
        languageCheck(language);
        languageSelector(language);
    });
   
   // OTHER OPTIONS

    $("input").click(function(){
        var input_name = $(this).attr("name");
        var column = ($(this).parents(".text-title")).index();
        var actual_column = $(".text-container").filter(function () {
             return $(this).parent().index() == column
         });
        if ($(this).is(":checked")) {
            columns_master[column][input_name] = true;
            visual_on(actual_column, input_name);
            if (input_name == "expan"){
                columns_master[column]["abbr"] = false;
                visual_off(actual_column, "abbr")
            }else if (input_name == "hi"){
                actual_column.find("span.inner-span-decoration").parent("span").addClass("tei_hi_decoration");
                actual_column.find("span.ph_red").addClass("red");
            };
        } else {
            columns_master[column][input_name] = false;
            visual_off(actual_column, input_name);
            if (input_name == "expan"){
                columns_master[column]["abbr"] = true;
                visual_on(actual_column, "abbr");
            }else if (input_name == "hi"){
                actual_column.find("span.tei_hi_decoration").removeClass("tei_hi_decoration");
                actual_column.find("span.red").removeClass("red").addClass("ph_red");
            };
        }
    });
    
    
    
    /*    Option: Normalised Text*/
    $("input[name=normalizierung]").change(function () {
        var columnIndex = ($(this).parents(".text-title")).index(); //index of the column starting at 0
        
        var columnObject = $(".text-container").filter(function () {
        // the actual JQuery object for the column to change
            return $(this).parents(".edition-text").index() == columnIndex;
        });
        columnObject.empty();
        
        if ($(this).is(":checked")) {
            columnObject.load('HTML_TEXTS/'+columns_master[columnIndex]['text']+'_reg.html', function(){$(".text-container").find("td").css("font-size", font_size+"px");});
            columns_master[columnIndex]['normal'] = true;
        } else {
            columnObject.load('HTML_TEXTS/'+columns_master[columnIndex]['text']+'_orig.html', function(){$(".text-container").find("td").css("font-size", font_size+"px");});
            columns_master[columnIndex]['normal'] = false;
        };
        
    });
    
    // /*    Option: Right Margin References*/
    // $("input[name=notes]").change(function () {
    //     var column = ($(this).parents(".text-title")).index();
    //     var actual_column = $(".text-container").filter(function () {
    //         return $(this).parent().index() == column
    //     });
    //     if ($(this).is(":checked")) {
    //         actual_column.find("td.folioetc").removeClass("hidden");
    //     } else {
    //         actual_column.find("td.folioetc").addClass("hidden");
    //     };
    // });
    
    
    /*    Option: Numbering (Manuscript or Edition)*/
    $("input[name^=numerierung]").change(function () {
        var column = ($(this).parents(".text-title")).index();
        var actual_column = $(".text-container").filter(function () {
            return $(this).parent().index() == column
        });
        if ($(this).val() == "manuscript") {
            actual_column.find("span.ms_line").removeClass("hidden");
            actual_column.find("span.edit_line").addClass("hidden");
            actual_column.find("span.corresp_line").addClass("hidden");
        }
        if ($(this).val() == "edition") {
            actual_column.find("span.ms_line").addClass("hidden");
            actual_column.find("span.edit_line").removeClass("hidden");
            actual_column.find("span.corresp_line").addClass("hidden");
        } else if ($(this).val() == "alt_ed") {
            actual_column.find("span.ms_line").addClass("hidden");
            actual_column.find("span.edit_line").addClass("hidden");
            actual_column.find("span.corresp_line").removeClass("hidden");
        }
    });

    /*    Option: Font-size*/
    $("select[id=font_control]").change(function () {
        font_size = $(this).val();
        console.log(font_size);
        $(".text-container").find("td").css("font-size", font_size+"px");
        $(".text-container").css("font-size", font_size+"px");
    });

});