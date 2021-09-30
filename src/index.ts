import { Command, flags } from '@oclif/command';
import * as fss from 'fs';

import * as Path from 'path';
import * as xml2json from 'xml2json';
import notEmpty from './notEmpty';

const fs = fss.promises;

// magic number!
const shipLogManagerPathID = 30373;
const uiStyleManagerPathID = 8059;

type AssetXml = {
  Name: string;
  Container: string;
  Type: {
    id: number;
    $t: string;
  };
  PathID: number;
  Source: string;
  Size: number;
};

type AssetsXml = {
  Assets: {
    filename: string;
    createdAt: string;
    Asset: AssetXml[];
  };
};

type AssetMeta = {
  m_FileID: number;
  m_PathID: number;
};

type Asset = {
  m_GameObject: AssetMeta;
  m_Enabled: 1 | 0;
  m_Script: AssetMeta;
  m_Name: string;
} & Record<string, unknown>;

type ManagerSource = Asset & {
  _shipLogXmlAssets: AssetMeta[];
  _shipLogLibrary: AssetMeta;
};

type LibrarySource = Asset & {
  defaultEntrySprite: AssetMeta;
  entryData: {
    id: string;
    sprite: AssetMeta;
    altSprite: AssetMeta;
    cardPosition: {
      x: number;
      y: number;
    };
  }[];
};

type Library = {
  defaultSpritePath: string;
  entries: {
    id: string;
    spritePath: string;
    altSpritePath?: string;
    cardPosition: {
      x: number;
      y: number;
    };
  }[];
};

type AstroObjectRumorsFactXml = {
  ID: string;
  SourceID: string;
  Text: string;
};

type AstroObjectExploreFactXml = {
  ID: string;
  Text: string;
};

type AstroObjectEntryXml = {
  ID: string;
  Name: string;
  Curiosity?: string;
  IsCuriosity?: boolean;
  AltPhotoCondition?: string;

  RumorFact: AstroObjectRumorsFactXml[] | AstroObjectRumorsFactXml;
  ExploreFact: AstroObjectExploreFactXml[] | AstroObjectExploreFactXml;
  Entry?: AstroObjectEntryXml[] | AstroObjectEntryXml;
};

type AstroObjectEntriesXml = {
  AstroObjectEntry: {
    ID: string;
    Entry: AstroObjectEntryXml[] | AstroObjectEntryXml;
  };
};

type AstroObjectEntryExploreFact = {
  id: string;
  text: string;
};

type AstroObjectEntryRumourFact = {
  id: string;
  text: string;
  sourceId: string;
};

type AstroObjectEntry = {
  id: string;
  parentId?: string;

  name: string;
  curiousity?: string;
  isCuriousity: boolean;

  altPhotoCondition?: string;

  facts: {
    explore: AstroObjectEntryExploreFact[];
    rumor: AstroObjectEntryRumourFact[];
  };
};

type ShipLog = {
  id: string;
  entries: AstroObjectEntry[];
};

type RGB = {
  r: number;
  g: number;
  b: number;
};

type RedGreenBlue = {
  red: number;
  green: number;
  blue: number;
  hex: string;
};

type ThemeSource = {
  _invisiblePlanetColor: RGB;
  _invisiblePlanetHighlight: RGB;
  _menuBackgroundColorDisabled: RGB;
  _menuBackgroundColorIntermediateSelect: RGB;
  _menuBackgroundColorNormal: RGB;
  _menuBackgroundColorPressed: RGB;
  _menuBackgroundColorSelected: RGB;
  _menuButtonBackgroundColorDisabled: RGB;
  _menuButtonBackgroundColorIntermediateSelect: RGB;
  _menuButtonBackgroundColorNormal: RGB;
  _menuButtonBackgroundColorPressed: RGB;
  _menuButtonBackgroundColorSelected: RGB;
  _menuButtonForegroundColorDisabled: RGB;
  _menuButtonForegroundColorIntermediateSelect: RGB;
  _menuButtonForegroundColorNormal: RGB;
  _menuButtonForegroundColorPressed: RGB;
  _menuButtonForegroundColorSelected: RGB;
  _menuForegroundColorDisabled: RGB;
  _menuForegroundColorIntermediateSelect: RGB;
  _menuForegroundColorNormal: RGB;
  _menuForegroundColorPressed: RGB;
  _menuForegroundColorSelected: RGB;
  _menuSecondaryBackgroundColorDisabled: RGB;
  _menuSecondaryBackgroundColorIntermediateSelect: RGB;
  _menuSecondaryBackgroundColorNormal: RGB;
  _menuSecondaryBackgroundColorPressed: RGB;
  _menuSecondaryBackgroundColorSelected: RGB;
  _menuSecondaryForegroundColorDisabled: RGB;
  _menuSecondaryForegroundColorIntermediateSelect: RGB;
  _menuSecondaryForegroundColorNormal: RGB;
  _menuSecondaryForegroundColorPressed: RGB;
  _menuSecondaryForegroundColorSelected: RGB;
  _neutralColor: RGB;
  _neutralHighlight: RGB;
  _popupBlockerColor: RGB;
  _primaryHighlightColor: RGB;
  _quantumMoonColor: RGB;
  _quantumMoonHighlight: RGB;
  _secondaryHighlightColor: RGB;
  _shipLogRumorColor: RGB;
  _shipLogSelectionColor: RGB;
  _sunkenModuleColor: RGB;
  _sunkenModuleHighlight: RGB;
  _timeLoopColor: RGB;
  _timeLoopHighlight: RGB;
  _vesselColor: RGB;
  _vesselHighlight: RGB;
};

type Theme = {
  invisiblePlanetColor: RedGreenBlue;
  invisiblePlanetHighlight: RedGreenBlue;
  menuBackgroundColorDisabled: RedGreenBlue;
  menuBackgroundColorIntermediateSelect: RedGreenBlue;
  menuBackgroundColorNormal: RedGreenBlue;
  menuBackgroundColorPressed: RedGreenBlue;
  menuBackgroundColorSelected: RedGreenBlue;
  menuButtonBackgroundColorDisabled: RedGreenBlue;
  menuButtonBackgroundColorIntermediateSelect: RedGreenBlue;
  menuButtonBackgroundColorNormal: RedGreenBlue;
  menuButtonBackgroundColorPressed: RedGreenBlue;
  menuButtonBackgroundColorSelected: RedGreenBlue;
  menuButtonForegroundColorDisabled: RedGreenBlue;
  menuButtonForegroundColorIntermediateSelect: RedGreenBlue;
  menuButtonForegroundColorNormal: RedGreenBlue;
  menuButtonForegroundColorPressed: RedGreenBlue;
  menuButtonForegroundColorSelected: RedGreenBlue;
  menuForegroundColorDisabled: RedGreenBlue;
  menuForegroundColorIntermediateSelect: RedGreenBlue;
  menuForegroundColorNormal: RedGreenBlue;
  menuForegroundColorPressed: RedGreenBlue;
  menuForegroundColorSelected: RedGreenBlue;
  menuSecondaryBackgroundColorDisabled: RedGreenBlue;
  menuSecondaryBackgroundColorIntermediateSelect: RedGreenBlue;
  menuSecondaryBackgroundColorNormal: RedGreenBlue;
  menuSecondaryBackgroundColorPressed: RedGreenBlue;
  menuSecondaryBackgroundColorSelected: RedGreenBlue;
  menuSecondaryForegroundColorDisabled: RedGreenBlue;
  menuSecondaryForegroundColorIntermediateSelect: RedGreenBlue;
  menuSecondaryForegroundColorNormal: RedGreenBlue;
  menuSecondaryForegroundColorPressed: RedGreenBlue;
  menuSecondaryForegroundColorSelected: RedGreenBlue;
  neutralColor: RedGreenBlue;
  neutralHighlight: RedGreenBlue;
  popupBlockerColor: RedGreenBlue;
  primaryHighlightColor: RedGreenBlue;
  quantumMoonColor: RedGreenBlue;
  quantumMoonHighlight: RedGreenBlue;
  secondaryHighlightColor: RedGreenBlue;
  shipLogRumorColor: RedGreenBlue;
  shipLogSelectionColor: RedGreenBlue;
  sunkenModuleColor: RedGreenBlue;
  sunkenModuleHighlight: RedGreenBlue;
  timeLoopColor: RedGreenBlue;
  timeLoopHighlight: RedGreenBlue;
  vesselColor: RedGreenBlue;
  vesselHighlight: RedGreenBlue;
};

type AssetXmlTester = (asset: AssetXml) => boolean;
type JSONAssetTester = (asset: Asset) => boolean;
type XMLAssetTester = (asset: Record<string, unknown>) => boolean;

const testIsSprite: AssetXmlTester = (asset) => asset.Type.id === 213;

const xml2jsonOptions: { object: true } & xml2json.JsonOptions = {
  object: true,
  coerce: true,
};

const arrayify = <T>(o: T | T[] | undefined): T[] => {
  if (o === undefined) {
    return [];
  }

  return Array.isArray(o) ? o : [o];
};

class OuterWildsExtractor extends Command {
  static description = 'via AssetStudio, to the world';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    in: flags.string({
      char: 'i',
      description: 'AssetStudio dump folder',
      required: true,
    }),
    out: flags.string({
      char: 'o',
      description: 'Output folder',
      required: true,
    }),
  };

  async run() {
    const { flags } = this.parse(OuterWildsExtractor);

    const inDir = Path.resolve(flags.in);
    const outDir = Path.resolve(flags.out);

    const assetsXmlPath = Path.join(inDir, 'assets.xml');
    const assets = xml2json.toJson(
      await fs.readFile(assetsXmlPath, 'utf8'),
      xml2jsonOptions
    ) as AssetsXml;

    const pathForAsset = (assetXml: AssetXml): string => {
      const ext = (() => {
        switch (assetXml.Type.id) {
          case 49:
            return 'txt';
          case 114:
            return 'json';
          case 28:
          case 213:
            return 'png';
          default:
            return 'dat';
        }
      })();

      return Path.join(inDir, assetXml.Type.$t, assetXml.Name + '.' + ext);
    };

    const pathForPathID = (
      pathID: number,
      tester: AssetXmlTester | undefined = undefined
    ): string => {
      const matches = assets.Assets.Asset.filter(
        (asset) =>
          asset.PathID === pathID &&
          (tester === undefined ? true : tester(asset))
      );

      if (matches.length > 1) {
        console.warn(`Got ${matches.length} for pathID: ${pathID}`);
      }

      const match = matches[0];

      if (match === undefined) {
        throw new Error(`no path found for path ID: ${pathID}`);
      }

      return pathForAsset(match);
    };

    const pathForPathIDOptional = (
      pathID: number,
      tester: AssetXmlTester | undefined = undefined
    ): string | undefined => {
      try {
        return pathForPathID(pathID, tester);
      } catch {}
    };

    const jsonForPathID = async <T>(
      pathID: number,
      tester: JSONAssetTester | undefined = undefined
    ): Promise<T> => {
      const path = pathForPathID(
        pathID,
        tester == null
          ? undefined
          : (assetXml) => {
              try {
                const path = pathForAsset(assetXml);
                const json = JSON.parse(
                  fss.readFileSync(path, 'utf8')
                ) as Asset;
                return tester(json);
              } catch {}

              return false;
            }
      );

      if (path === undefined) {
        throw new Error(`can't find path for PathID: ${pathID}`);
      }

      const json = JSON.parse(await fs.readFile(path, 'utf8'));

      return json as T;
    };

    const xmlForPathID = async <T>(
      pathID: number,
      tester: XMLAssetTester | undefined = undefined
    ): Promise<T | undefined> => {
      const path = pathForPathID(
        pathID,
        tester == null
          ? undefined
          : (assetXml) => {
              try {
                const path = pathForAsset(assetXml);
                const str = fss.readFileSync(path, 'utf8');
                const xml = xml2json.toJson(str, xml2jsonOptions);
                return tester(xml);
              } catch {}

              return false;
            }
      );

      if (path === undefined) {
        return undefined;
      }

      const json = xml2json.toJson(
        await fs.readFile(path, 'utf8'),
        xml2jsonOptions
      );

      return (json as any) as T;
    };

    const managerSource = await jsonForPathID<ManagerSource>(
      shipLogManagerPathID
    );

    const librarySource = await jsonForPathID<LibrarySource>(
      managerSource._shipLogLibrary.m_PathID,
      (asset) => {
        return asset.entryData != null;
      }
    );

    const basenameOptional = (s: string | undefined): string | undefined =>
      s == null ? s : Path.basename(s);

    const library: Library = {
      defaultSpritePath: Path.basename(
        pathForPathID(librarySource.defaultEntrySprite.m_PathID, testIsSprite)
      ),
      entries: librarySource.entryData.map((entryDatum) => ({
        id: entryDatum.id,
        spritePath: Path.basename(
          pathForPathID(
            entryDatum.sprite.m_PathID,
            (asset) => asset.Type.id === 213
          )
        ),
        altSpritePath: basenameOptional(
          pathForPathIDOptional(entryDatum.altSprite.m_PathID, testIsSprite)
        ),
        cardPosition: entryDatum.cardPosition,
      })),
    };

    const shipLogEntries: ShipLog[] = [];

    const entryify = (
      entries: AstroObjectEntryXml[],
      parentId: string | undefined = undefined
    ): AstroObjectEntry[] =>
      entries.flatMap((entry) => [
        {
          id: entry.ID,
          name: entry.Name,
          isCuriousity: entry.IsCuriosity ?? false,
          curiousity: entry.Curiosity,
          altPhotoCondition: entry.AltPhotoCondition,
          parentId: parentId,
          facts: {
            explore: arrayify(entry.ExploreFact).map((exploreFact) => ({
              id: exploreFact.ID,
              text: exploreFact.Text,
            })),
            rumor: arrayify(entry.RumorFact).map((rumorFact) => ({
              id: rumorFact.ID,
              text: rumorFact.Text,
              sourceId: rumorFact.SourceID,
            })),
          },
        },
        ...entryify(arrayify(entry.Entry), entry.ID),
      ]);

    for (const shipLogXmlAssets of managerSource._shipLogXmlAssets) {
      const xml = await xmlForPathID<AstroObjectEntriesXml>(
        shipLogXmlAssets.m_PathID
      );

      if (xml == null) {
        continue;
      }

      shipLogEntries.push({
        id: xml.AstroObjectEntry.ID,
        entries: entryify(arrayify(xml.AstroObjectEntry.Entry)),
      });
    }

    const styleManagerSource = await jsonForPathID<ThemeSource>(
      uiStyleManagerPathID
    );

    // assume input 0-1, output 0-255
    const rgbify = (source: RGB): RedGreenBlue => {
      const red = Math.floor(source.r * 255);
      const green = Math.floor(source.g * 255);
      const blue = Math.floor(source.b * 255);

      const hexxy = (i: number): string => i.toString(16).padStart(2, '0');

      return {
        red,
        green,
        blue,
        hex: `#${hexxy(red)}${hexxy(green)}${hexxy(blue)}`,
      };
    };

    const theme: Theme = {
      invisiblePlanetColor: rgbify(styleManagerSource._invisiblePlanetColor),
      invisiblePlanetHighlight: rgbify(
        styleManagerSource._invisiblePlanetHighlight
      ),
      menuBackgroundColorDisabled: rgbify(
        styleManagerSource._menuBackgroundColorDisabled
      ),
      menuBackgroundColorIntermediateSelect: rgbify(
        styleManagerSource._menuBackgroundColorIntermediateSelect
      ),
      menuBackgroundColorNormal: rgbify(
        styleManagerSource._menuBackgroundColorNormal
      ),
      menuBackgroundColorPressed: rgbify(
        styleManagerSource._menuBackgroundColorPressed
      ),
      menuBackgroundColorSelected: rgbify(
        styleManagerSource._menuBackgroundColorSelected
      ),
      menuButtonBackgroundColorDisabled: rgbify(
        styleManagerSource._menuButtonBackgroundColorDisabled
      ),
      menuButtonBackgroundColorIntermediateSelect: rgbify(
        styleManagerSource._menuButtonBackgroundColorIntermediateSelect
      ),
      menuButtonBackgroundColorNormal: rgbify(
        styleManagerSource._menuButtonBackgroundColorNormal
      ),
      menuButtonBackgroundColorPressed: rgbify(
        styleManagerSource._menuButtonBackgroundColorPressed
      ),
      menuButtonBackgroundColorSelected: rgbify(
        styleManagerSource._menuButtonBackgroundColorSelected
      ),
      menuButtonForegroundColorDisabled: rgbify(
        styleManagerSource._menuButtonForegroundColorDisabled
      ),
      menuButtonForegroundColorIntermediateSelect: rgbify(
        styleManagerSource._menuButtonForegroundColorIntermediateSelect
      ),
      menuButtonForegroundColorNormal: rgbify(
        styleManagerSource._menuButtonForegroundColorNormal
      ),
      menuButtonForegroundColorPressed: rgbify(
        styleManagerSource._menuButtonForegroundColorPressed
      ),
      menuButtonForegroundColorSelected: rgbify(
        styleManagerSource._menuButtonForegroundColorSelected
      ),
      menuForegroundColorDisabled: rgbify(
        styleManagerSource._menuForegroundColorDisabled
      ),
      menuForegroundColorIntermediateSelect: rgbify(
        styleManagerSource._menuForegroundColorIntermediateSelect
      ),
      menuForegroundColorNormal: rgbify(
        styleManagerSource._menuForegroundColorNormal
      ),
      menuForegroundColorPressed: rgbify(
        styleManagerSource._menuForegroundColorPressed
      ),
      menuForegroundColorSelected: rgbify(
        styleManagerSource._menuForegroundColorSelected
      ),
      menuSecondaryBackgroundColorDisabled: rgbify(
        styleManagerSource._menuSecondaryBackgroundColorDisabled
      ),
      menuSecondaryBackgroundColorIntermediateSelect: rgbify(
        styleManagerSource._menuSecondaryBackgroundColorIntermediateSelect
      ),
      menuSecondaryBackgroundColorNormal: rgbify(
        styleManagerSource._menuSecondaryBackgroundColorNormal
      ),
      menuSecondaryBackgroundColorPressed: rgbify(
        styleManagerSource._menuSecondaryBackgroundColorPressed
      ),
      menuSecondaryBackgroundColorSelected: rgbify(
        styleManagerSource._menuSecondaryBackgroundColorSelected
      ),
      menuSecondaryForegroundColorDisabled: rgbify(
        styleManagerSource._menuSecondaryForegroundColorDisabled
      ),
      menuSecondaryForegroundColorIntermediateSelect: rgbify(
        styleManagerSource._menuSecondaryForegroundColorIntermediateSelect
      ),
      menuSecondaryForegroundColorNormal: rgbify(
        styleManagerSource._menuSecondaryForegroundColorNormal
      ),
      menuSecondaryForegroundColorPressed: rgbify(
        styleManagerSource._menuSecondaryForegroundColorPressed
      ),
      menuSecondaryForegroundColorSelected: rgbify(
        styleManagerSource._menuSecondaryForegroundColorSelected
      ),
      neutralColor: rgbify(styleManagerSource._neutralColor),
      neutralHighlight: rgbify(styleManagerSource._neutralHighlight),
      popupBlockerColor: rgbify(styleManagerSource._popupBlockerColor),
      primaryHighlightColor: rgbify(styleManagerSource._primaryHighlightColor),
      quantumMoonColor: rgbify(styleManagerSource._quantumMoonColor),
      quantumMoonHighlight: rgbify(styleManagerSource._quantumMoonHighlight),
      secondaryHighlightColor: rgbify(
        styleManagerSource._secondaryHighlightColor
      ),
      shipLogRumorColor: rgbify(styleManagerSource._shipLogRumorColor),
      shipLogSelectionColor: rgbify(styleManagerSource._shipLogSelectionColor),
      sunkenModuleColor: rgbify(styleManagerSource._sunkenModuleColor),
      sunkenModuleHighlight: rgbify(styleManagerSource._sunkenModuleHighlight),
      timeLoopColor: rgbify(styleManagerSource._timeLoopColor),
      timeLoopHighlight: rgbify(styleManagerSource._timeLoopHighlight),
      vesselColor: rgbify(styleManagerSource._vesselColor),
      vesselHighlight: rgbify(styleManagerSource._vesselHighlight),
    };

    // console.log(managerSource);

    const libraryPaths: string[] = [
      library.defaultSpritePath,
      ...library.entries
        .flatMap((entry) => [entry.spritePath, entry.altSpritePath])
        .filter(notEmpty),
    ].map((name) => Path.join(inDir, 'Sprite', name));

    // console.log({ libraryPaths });

    // console.log({ library });
    // console.log({ shipLogEntries });
    // console.log({ theme });

    if (!fss.existsSync(outDir)) {
      await fs.mkdir(outDir);
    }

    const libraryDest = Path.join(outDir, 'library.json');
    console.log(`writing library to ${libraryDest}`);
    await fs.writeFile(libraryDest, JSON.stringify(library, null, 2));

    const entriesDest = Path.join(outDir, 'entries.json');
    console.log(`writing entries to ${entriesDest}`);
    await fs.writeFile(entriesDest, JSON.stringify(shipLogEntries, null, 2));

    const themeDest = Path.join(outDir, 'theme.json');
    console.log(`writing theme to ${themeDest}`);
    await fs.writeFile(themeDest, JSON.stringify(theme, null, 2));

    const spriteOutDir = Path.join(outDir, 'sprites');
    if (!fss.existsSync(spriteOutDir)) {
      await fs.mkdir(spriteOutDir);
    }

    for (const path of libraryPaths) {
      const dest = Path.join(spriteOutDir, Path.basename(path));

      console.log(`copying ${path} to ${dest}`);
      await fs.copyFile(path, dest);
    }

    console.log(`output contents to ${outDir} complete!`);
  }
}

export = OuterWildsExtractor;
