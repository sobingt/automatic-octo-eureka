var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'menu';
	locals.filters = {
		menu: req.params.menu
	};
	locals.data = {
		menus: []
	};
	
	// Load the current menu
	view.on('init', function(next) {
		
		var q = keystone.list('Menu').model.findOne({
			state: 'published',
			slug: locals.filters.menu
		}).populate('author categories');
		
		q.exec(function(err, result) {
			locals.data.menu = result;
			next(err);
		});
		
	});
	
	// Load other menus
	view.on('init', function(next) {
		
		var q = keystone.list('Menu').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.menus = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('menu');
	
};
