import { acceptance } from "helpers/qunit-helpers";
acceptance("Admin - Watched Words", { loggedIn: true });

QUnit.test("list words in groups", assert => {
  visit("/admin/watched_words/action/block");
  andThen(() => {
    assert.ok(exists('.watched-words-list'));
    assert.ok(!exists('.watched-words-list .watched-word'));
  });

  fillIn('.admin-controls .controls input[type=text]', 'li');
  andThen(() => {
    assert.equal(find('.watched-words-list .watched-word').length, 1);
  });

  fillIn('.admin-controls .controls input[type=text]', '');
  andThen(() => {
    assert.ok(!exists('.watched-words-list .watched-word'));
  });

  click('.show-words-checkbox');
  andThen(() => {
    assert.ok(exists('.watched-words-list .watched-word'));
  });

  click('.nav-stacked .censor');
  andThen(() => {
    assert.ok(exists('.watched-words-list'));
    assert.ok(!exists('.watched-words-list .watched-word')); // 0 censored words
  });
});

QUnit.test("add words", assert => {
  visit("/admin/watched_words/action/block");
  andThen(() => {
    click('.show-words-checkbox');
    fillIn('.watched-word-form input', 'poutine');
  });
  click('.watched-word-form button');
  andThen(() => {
    let found = [];
    _.each(find('.watched-words-list .watched-word'), i => {
      if ($(i).text().trim() === 'poutine') {
        found.push(true);
      }
    });
    assert.equal(found.length, 1);
  });
});

QUnit.test("remove words", assert => {
  visit("/admin/watched_words/action/block");
  click('.show-words-checkbox');

  let word = null;
  andThen(() => {
    _.each(find('.watched-words-list .watched-word'), i => {
      if ($(i).text().trim() === 'anise') {
        word = i;
      }
    });
    click('#' + $(word).attr('id'));
  });
  andThen(() => {
    assert.equal(find('.watched-words-list .watched-word').length, 1);
  });
});

