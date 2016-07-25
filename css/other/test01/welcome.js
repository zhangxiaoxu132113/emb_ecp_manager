(function() {
  var init, isMobile, setupExamples, setupHero, _Drop;

  _Drop = Drop.createContext({
    classPrefix: 'drop'
  });

  isMobile = $(window).width() < 567;

  init = function() {

    return setupExamples();
  };


  setupExamples = function() {
    return $('.example').each(function() {
      var $example, $target, content, drop, openOn, theme;
      $example = $(this);
      theme = $example.data('theme');
      openOn = $example.data('open-on') || 'click';
      $target = $example.find('.drop-target');
      $target.addClass(theme);
      content = $example.find('.drop-content').html();
      return drop = new _Drop({
        target: $target[0],
        classes: theme,
        position: 'bottom center',
        constrainToWindow: true,
        constrainToScrollParent: false,
        openOn: openOn,
        content: content
      });
    });
  };

  init();

}).call(this);
