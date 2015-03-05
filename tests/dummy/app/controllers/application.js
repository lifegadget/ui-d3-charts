import Ember from 'ember';

export default Ember.Controller.extend({
	_chartType: 'bullet',
	chartType: function() {
		let choices = ['bullet','bar','tree','arc','pie'];
		let flags = {};
		for (let choice of choices) {
			flags[choice]= this.get('_chartType') === choice;
		}
		return flags;
	}.property('_chartType'),
	_init: function() {
		this.$('li a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});
	},
	actions: {
		tabpane: function(whichTab) {
			console.log('tab focus to %s', whichTab);
			this.set('_chartType', whichTab);
		}
	}
});
