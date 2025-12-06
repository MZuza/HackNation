import { CapitalizeFirstLetterPipe } from '@app/shared/pipes/capitalize-first-letter.pipe';

describe('CapitalizeFirstLetterPipe', () => {
  it('should create an instance', () => {
    expect(new CapitalizeFirstLetterPipe()).toBeTruthy();
  });

  it('should capitalize first letter', () => {
    const pipe = new CapitalizeFirstLetterPipe();
    const text = 'lorem ipsum';
    const textToCompare = 'Lorem ipsum';

    expect(pipe.transform(text)).toEqual(textToCompare);
  });
});
