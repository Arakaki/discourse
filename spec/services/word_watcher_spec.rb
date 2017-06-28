require 'rails_helper'

describe WordWatcher do

  let(:raw) { "Do you like liquorice?\n\nI really like them. One could even say that I am *addicted* to liquorice. Anf if\nyou can mix it up with some anise, then I'm in heaven ;)" }

  after do
    $redis.flushall
  end

  describe "word_matches_for_action?" do
    it "is falsey when there are no watched words" do
      expect(described_class.new(raw).word_matches_for_action?(:require_approval)).to be_falsey
    end

    context "with watched words" do
      let!(:anise) { Fabricate(:watched_word, word: "anise", action: WatchedWord.actions[:require_approval]) }

      it "is falsey without a match" do
        expect(described_class.new("No liquorice for me, thanks...").word_matches_for_action?(:require_approval)).to be_falsey
      end

      it "is returns matched words if there's a match" do
        m = described_class.new(raw).word_matches_for_action?(:require_approval)
        expect(m).to be_truthy
        expect(m[1]).to eq(anise.word)
      end

      it "finds at start of string" do
        m = described_class.new("#{anise.word} is garbage").word_matches_for_action?(:require_approval)
        expect(m[1]).to eq(anise.word)
      end

      it "finds at end of string" do
        m = described_class.new("who likes #{anise.word}").word_matches_for_action?(:require_approval)
        expect(m[1]).to eq(anise.word)
      end

      it "finds non-letters in place of letters" do
        Fabricate(:watched_word, word: "co(onut", action: WatchedWord.actions[:require_approval])
        m = described_class.new("This co(onut is delicious.").word_matches_for_action?(:require_approval)
        expect(m[1]).to eq("co(onut")
      end

      it "handles * for wildcards" do
        Fabricate(:watched_word, word: "a**le*", action: WatchedWord.actions[:require_approval])
        m = described_class.new("I acknowledge you.").word_matches_for_action?(:require_approval)
        expect(m[1]).to eq("acknowledge")
      end
    end
  end

end
