// Email and phone ship encoded (reversed, then base64) so scrapers that grep the raw HTML
// for addresses and numbers find nothing. A visitor clicks once to see them. This stops
// harvesters, not a determined bot driving a real browser; nothing on a public page can.
(function () {
  function decode(encoded) {
    return atob(encoded).split('').reverse().join('');
  }

  function hrefFor(kind, value) {
    // tel: links need the bare digits with a country code to dial correctly on phones.
    return kind === 'email' ? 'mailto:' + value : 'tel:+1' + value.replace(/\D/g, '');
  }

  document.querySelectorAll('button.reveal').forEach(function (button) {
    button.addEventListener('click', function () {
      var kind = button.dataset.kind;
      // Reveal every copy of the same detail at once, so the header and Contact section
      // never disagree about what's shown.
      document.querySelectorAll('button.reveal[data-kind="' + kind + '"]').forEach(function (b) {
        var value = decode(b.dataset.v);
        var link = document.createElement('a');
        link.href = hrefFor(kind, value);
        link.textContent = value;
        b.replaceWith(link);
        // Keep keyboard focus on the thing the visitor just activated instead of losing it
        // to the top of the page when the button disappears.
        if (b === button) link.focus();
      });
    });
  });
})();
