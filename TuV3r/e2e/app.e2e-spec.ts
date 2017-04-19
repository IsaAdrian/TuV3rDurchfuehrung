import { TuV3rPage } from './app.po';

describe('tu-v3r App', function() {
  let page: TuV3rPage;

  beforeEach(() => {
    page = new TuV3rPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
