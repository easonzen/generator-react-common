const Generator = require('yeoman-generator');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash/string');
const chalk = require('chalk');

class App extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "package name:"
            },
            {
                type: "input",
                name: "version",
                message: "version:",
                default: "1.0.0"
            },
            {
                type: "input",
                name: "description",
                message: "description:"
            },
            {
                type: "input",
                name: "author",
                message: "author:"
            }
        ]);

        this.log("name: ", this.answers.name);
        this.log("version: ", this.answers.version);
        this.log("description: ", this.answers.description);
        this.log("author: ", this.answers.author);
    }

    configuring() {
        fs.mkdir(this.answers.name);
    }

    async _generatorPkgJson() {
        const pkgJson = {
            name: this.answers.name,
            version: this.answers.version,
            description: this.answers.description,
            main: "dist/index.js",
            types: "dist/index.d.ts",
            files: [
                "dist",
                "README.md",
                "LICENSE"
            ],
            scripts: {
                "start": "webpack serve --config config/webpack.dev.config.js --open --hot",
                "build": "webpack --config config/webpack.prod.config.js && tsc",
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            devDependencies: {
                "@babel/core": "^7.13.15",
                "@babel/plugin-proposal-class-properties": "^7.13.0",
                "@babel/plugin-proposal-decorators": "^7.13.15",
                "@babel/plugin-proposal-object-rest-spread": "^7.13.8",
                "@babel/plugin-proposal-optional-chaining": "^7.13.12",
                "@babel/plugin-transform-runtime": "^7.13.15",
                "@babel/preset-env": "^7.13.15",
                "@babel/preset-react": "^7.13.13",
                "@babel/preset-typescript": "^7.13.0",
                "@types/react": "^17.0.3",
                "@types/react-dom": "^17.0.3",
                "babel-loader": "^8.2.2",
                "css-loader": "^5.2.1",
                "html-webpack-plugin": "^5.3.1",
                "prettier": "^2.2.1",
                "react": "^17.0.2",
                "react-dom": "^17.0.2",
                "sass": "^1.32.11",
                "sass-loader": "^11.0.1",
                "style-loader": "^2.0.0",
                "terser-webpack-plugin": "^5.1.1",
                "ts-loader": "^8.1.0",
                "typescript": "^4.2.4",
                "webpack": "^5.33.2",
                "webpack-cli": "^4.6.0",
                "webpack-dev-server": "^3.11.2",
                "webpack-merge": "^5.7.3",
            },
            peerDependencies: {
                "react": "^17.0.2",
                "react-dom": "^17.0.2"
            },
            browserslist: {
                "production": [
                    ">0.2%",
                    "not dead",
                    "not op_mini all"
                ],
                "development": [
                    "last 1 chrome version",
                    "last 1 firefox version",
                    "last 1 safari version"
                ]
            }
        };

        try {
            // Extend or create package.json file in destination path
            await this.fs.extendJSON(path.join(this.destinationRoot(), this.answers.name, 'package.json'), pkgJson);
        } catch (error) {
            this.log(error);
        }
    }

    async _changeReadMeFile() {
        const targetPath = path.join(this.destinationRoot(), this.answers.name, './README.md');

        try {
            const exists = await fs.pathExists(targetPath);

            if (exists) {
                const res = await fs.readFile(targetPath, 'utf-8');
                const option = {
                    appname: this.answers.name,
                    description: this.answers.description
                }
                await fs.outputFile(targetPath, _.template(res)(option), {
                    encoding: "utf-8"
                })
            }
        } catch (error) {
            this.log(error);
        }

    }

    async _copyTemplate() {
        this.log(chalk.green('   start to copy template files...'));
        try {
            await fs.copy(this.templatePath('../../templates'), path.join(this.destinationRoot(), this.answers.name));

            await this._changeReadMeFile();
        } catch (error) {
            this.log(error);
        }
        this.log(chalk.green('   copy successfully'));
    }

    async writing() {
        await this._copyTemplate();
        await this._generatorPkgJson();
    }

    install() {
        this.log('start to install project dependencies, this will be cost a few times...');

        try {
            this.npmInstall('', {}, {
                cwd: path.join(this.destinationRoot(), this.answers.name)
            });
        } catch (error) {
            this.log(error);
        }

    }

    end() {
        this.log(chalk.green('🎉🎉🎉 Done !'));
        this.log('');
        this.log(chalk.blueBright(`cd ${this.answers.name}`));
        this.log('');
        this.log('You can run some commands as below: ');
        this.log('');
        this.log(chalk.blueBright('npm start'));
        this.log('start to develop your project');
        this.log('');
        this.log(chalk.blueBright('npm run build'));
        this.log('start to bundle your project');
        this.log('');
    }
}

module.exports = App;