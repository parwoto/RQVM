import { ThesisPage } from './app.po';

describe('thesis App', () => {
  let page: ThesisPage;

  beforeEach(() => {
    page = new ThesisPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
