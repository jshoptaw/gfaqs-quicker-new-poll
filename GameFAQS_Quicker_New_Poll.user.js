// ==UserScript==
// @name           GameFAQs Quicker "New Poll"
// @namespace      OTACON120
// @author         OTACON120
// @version        1.0.1
// @description    Makes reaching the "Add a Poll" form easier/quicker
// @updateURL      http://userscripts.org/scripts/source/139594.meta.js
// @downloadURL    http://userscripts.org/scripts/source/139594.user.js
// @website        http://otacon120.com/user-scripts/gamefaqs-related/quicker-new-poll/
// @include        http://www.gamefaqs.com/boards/post.php?board=*
// @include        http://www.gamefaqs.com/boards/*-*
// @match          http://www.gamefaqs.com/boards/post.php?board=*
// @match          http://www.gamefaqs.com/boards/*-*
// @exclude        http://www.gamefaqs.com/boards/post.php?board=*&topic=*
// @exclude        http://www.gamefaqs.com/boards/post.php?board=*&poll=1
// @exclude        http://www.gamefaqs.com/boards/*-*?*
// @exclude        http://www.gamefaqs.com/boards/*-*/?*
// ==/UserScript==

var userLinks,
	newTopicLink,
	newPollLink,
	postForm,
	details,
	detailsOrigHTML,
	detailsPars,
	detailsEnd,
	newPollHTML = document.createDocumentFragment(),
	tmph,
	tmp,
	child,
	topicTitleInput,
	topicTitle,
	yourMessageInput,
	yourMessage,
	i;

if (window.location.pathname.indexOf('post.php') != -1) {
	postForm = document.getElementById('main_col').getElementsByTagName('form')[0];
	details = postForm.getElementsByClassName('details')[0];
	detailsPars = details.getElementsByTagName('p');
	newPollLink = detailsPars[0].getElementsByTagName('a')[0].href;
	detailsPars[0].innerHTML = 'To create a new topic, enter a title for the topic below and create the first message. You can also <a href="' + newPollLink + '">add a poll</a><span id="qnp-details-end"> to this topic</span>.';

	detailsEnd = document.getElementById('qnp-details-end');
	newPollLink = detailsPars[0].getElementsByTagName('a')[0];
	newPollLink.id = 'qnp-add-poll';

	function newPollClick() {
		if (newPollLink.id == 'qnp-add-poll') {
			detailsOrigHTML = details.innerHTML;
			newPollLink.innerHTML = '';
			// Specify HTML for "Add a Poll" form
			tmph = '<h3>Add a Poll</h3> <p>To add a poll to this topic, enter a question and from 2 to 10 options for users to select from. Once created, you cannot edit the poll, so make sure it looks right before you post it.</p> <p><b>Poll Question:</b><br> <input type="text" value="" name="poll_text" maxlength="200" size="70"><br> (Between 5 and 200 characters in length) </p><p><b>Poll Options:</b><br></p><ol> <li><input type="text" value="" name="poll_option_1" maxlength="120" size="70"></li> <li><input type="text" value="" name="poll_option_2" maxlength="120" size="70"></li> <li><input type="text" value="" name="poll_option_3" maxlength="120" size="70"></li> <li><input type="text" value="" name="poll_option_4" maxlength="120" size="70"></li> <li><input type="text" value="" name="poll_option_5" maxlength="120" size="70"></li> <li><input type="text" value="" name="poll_option_6" maxlength="120" size="70"></li> <li><input type="text" value="" name="poll_option_7" maxlength="120" size="70"></li> <li><input type="text" value="" name="poll_option_8" maxlength="120" size="70"></li> <li><input type="text" value="" name="poll_option_9" maxlength="120" size="70"></li> <li><input type="text" value="" name="poll_option_10" maxlength="120" size="70"></li> </ol> Who can vote in this poll? <select name="min_level"><option selected="selected" value="0" label="Anybody, registered or not">Anybody, registered or not</option> <option value="1" label="Only registered users">Only registered users</option> <option value="2" label="Only registered users, only 1 vote per IP">Only registered users, only 1 vote per IP</option> </select><br>';

			tmp = document.createElement('body')
			tmp.innerHTML = tmph;

			// Loop through above HTML to add into document fragment for eventual addition to page
			while (child = tmp.firstChild) {
				newPollHTML.appendChild(child);
			}
			details.insertBefore(newPollHTML, detailsPars[2]);
			detailsEnd.textContent = '';
			newPollLink.textContent = 'create a topic without a poll';
			newPollLink.href = newPollLink.href.replace('&amp;poll=1', '');
			postForm.action += '&poll=1';
			newPollLink.id = 'qnp-remove-poll';
		} else {
			topicTitleInput = document.getElementsByName('topictitle')[0];
			yourMessageInput = document.getElementsByName('messagetext')[0];
			topicTitle = topicTitleInput.value;
			yourMessage = yourMessageInput.value;
			details.innerHTML = detailsOrigHTML;
			topicTitleInput = document.getElementsByName('topictitle')[0];
			yourMessageInput = document.getElementsByName('messagetext')[0];
			topicTitleInput.value = topicTitle;
			yourMessageInput.value = yourMessage;
			detailsEnd.textContent = ' to this topic';
			postForm.action = postForm.action.replace('&poll=1', '');
			newPollLink = detailsPars[0].getElementsByTagName('a')[0];
			newPollLink.id = 'qnp-add-poll';
			newPollLink.onclick = function() {
				newPollClick();
				return false;
			}
		}
	}

	// Change link to add/remove form dynamically
	newPollLink.onclick = function() {
		newPollClick();
		return false;
	}
} else { // Add "New Poll" link to topic list
	userLinks = document.getElementById('content').getElementsByClassName('user')[0].getElementsByTagName('a');
	newPollLink = document.createElement('a');
	newPollLink.textContent = 'New Poll';

	for (i = 0; i < userLinks.length; i++) {
		if (userLinks[i].textContent == 'New Topic') {
			newTopicLink = userLinks[i];
			newPollLink.href = newTopicLink.href + '&amp;poll=1';
			newTopicLink.parentNode.insertBefore(newPollLink, newTopicLink.nextSibling);
			newTopicLink.parentNode.innerHTML = newTopicLink.parentNode.innerHTML.replace('<a href="' + newTopicLink.href + '&amp;amp;poll=1', ' | <a href="' + newPollLink.href);
			break;
		}
	}
}
