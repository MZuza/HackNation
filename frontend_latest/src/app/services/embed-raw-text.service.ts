import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import {CmsService} from '@app/services/cms.service';
import {IRawTextEmbed} from '@app/services/models/cms/controls/raw-text/raw-text-embed';
import {IRawTextObject} from '@app/services/models/cms/controls/raw-text/raw-text-object';
import {IRawTextObjectType} from '@app/services/models/cms/controls/raw-text/raw-text-object-type.enum';

/**
 *  Service with functions for embed text and objects
 */
@Injectable({
    providedIn: 'root'
})
export class EmbedRawTextService {

    /**
     * @ignore
     */
    constructor(private cmsService: CmsService,
                @Inject(DOCUMENT)private document: Document) {
    }

    /***
     * Extracts plain text from html-like string to build link for hyper editor
     * @param {} element
     * @return string
     */
    extractTextFromElement(element): string {
        const textElement = this.document.createElement('div');
        textElement.innerHTML = element;
        return textElement.querySelector('p').innerHTML;
    }

    /**
     * Check if text contains embed objects, and returns proper list of IRawTextObjects
     * @param {string} text to be changed
     * @return IRawTextObject[]
     */
    changeTextToRawTextObjectList(text: string): IRawTextObject[] {
        const embedElementsList = this.getEmbedElementsList(text);

        return (embedElementsList && embedElementsList.length > 0) ?
            [...this.createTextListWithEmbedObjects(text, embedElementsList)] : [this.createRawTextString(text)];
    }

    /**
     * Splits string on list of plain text and embed objects
     * @param {string} textToSplit
     * @param {string[]} embedElementsList
     * @return {IRawTextObject[]}
     */
    private createTextListWithEmbedObjects(textToSplit: string, embedElementsList: string[]): IRawTextObject[] {
        const rawTextObjects: IRawTextObject[] = [];
        for (let i = 0; i < embedElementsList.length; i++) {
            const splitText = textToSplit.split(embedElementsList[i]);
            if (splitText[0]) {
                rawTextObjects.push(this.createRawTextString(splitText[0]));
            }
            rawTextObjects.push(this.createRawTextEmbed(embedElementsList[i]));
            if (i === embedElementsList.length - 1) {
                rawTextObjects.push(this.createRawTextString(splitText.pop()));
            } else {
                textToSplit = splitText[1];
            }
        }
        return rawTextObjects;
    }

    /**
     * Create array of strings of embed objects
     * @param {string} text
     * @return string[]
     */
    private getEmbedElementsList(text: string): string[] {
        return text ? text.match(/(\<embed .*?\/>)/g) : [];
    }

    /**
     * Create text object
     * @param {string} value
     * @return IRawTextObject
     */
    private createRawTextString(value: string): IRawTextObject {
        const textElement = this.document.createElement('div');
        textElement.innerHTML = value;
        const linkList = Array.from(textElement.querySelectorAll('a'));

        linkList.map(linkNode => {
            const linkId = linkNode.id;
            // TODO CMS naprawić linki do dokumentów
            // const documentMetadata = this.cmsService.getDocumentMetadata(linkId);
            const documentMetadata = {href: null};
            linkNode.href = documentMetadata.href ? documentMetadata.href : linkNode.href;
        });

        return {
            text: textElement.innerHTML.toString(),
            type: IRawTextObjectType.STRING
        };
    }

    /**
     * Create embed object
     * @param {string} value
     * @return IRawTextEmbed
     */
    private createRawTextEmbed(value: string): IRawTextEmbed {
        const alt = this.match(value, /alt=".*?"/g);
        const embedtype = this.match(value, /embedtype=".*?"/g);
        const format = this.match(value, /format=".*?"/g);
        const url = this.match(value, /url=".*?"/g);
        const id = this.match(value, /id=".*?"/g);

        return {
            type: IRawTextObjectType.EMBED,
            alt: alt,
            embedType: embedtype,
            format: format,
            url: url,
            id: id
        };
    }

    /**
     * Matches string with regexp
     * @param {string} text
     * @param {string | RegExp} regexp
     * @return string
     */
    private match(text: string, regexp: string | RegExp): string {
        const findText = text.match(regexp);
        if (findText && findText.length === 1) {
            const findWord = findText[0].match(/"(.*)"/)[0];
            return findWord.substring(1, findWord.length - 1);
        } else {
            return '';
        }
    }
}
