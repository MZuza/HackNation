import { TruncateTextPipe } from './truncate-text.pipe';

describe('TruncateTextPipe', () => {
  let pipe;
  let text;

  beforeEach(() => {
    pipe = new TruncateTextPipe();
    text = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est nesciunt vitae nulla.';
  });

  it('should not truncate text when limit value is grater then text length', () => {
    expect(pipe.transform(text, 100).length).toEqual(83);
  });

  it('should truncate text when a comma (special char) is the last character in a substring', () => {
    expect(pipe.transform(text, 12)).toEqual('Lorem ipsum,');
    expect(pipe.transform(text, 12).length).toEqual(12);
  });

  it('should truncate text when a dot (special char) is the last character in a substring', () => {
    expect(pipe.transform(text, 57)).toEqual('Lorem ipsum, dolor sit amet consectetur adipisicing elit.');
    expect(pipe.transform(text, 57).length).toEqual(57);
  });

  it('should truncate text with "..." when a space is the last character in a substring', () => {
    expect(pipe.transform(text, 6)).toEqual('Lorem...');
    expect(pipe.transform(text, 6).length).toEqual(8);
  });

  it('should find the nearest space and truncate text with "..." when a space is not the last character in a substring', () => {
    expect(pipe.transform(text, 3)).toEqual('Lorem...');
    expect(pipe.transform(text, 3).length).toEqual(8);
  });

  it('should return full text when no space was found', () => {
    expect(pipe.transform(text, 80).length).toEqual(83);
  });
});
