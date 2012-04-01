




$(function() {
			$( ".connectedSortable" ).sortable({  				//every ul with class=connectedSortable vill be a DnD list
			//receive: function(event, ui) { alert(this);},  	//Lister that calls a function do update the graphic-precentage box
			connectWith: ".connectedSortable"
			}).disableSelection();
			});