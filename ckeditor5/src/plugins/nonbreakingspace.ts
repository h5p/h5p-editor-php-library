import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class NonBreakingSpace extends Plugin {
    static get pluginName() {
        return 'NonBreakingSpace';
    }

	init() {
		const editor = this.editor;

		editor.keystrokes.set('CTRL+SHIFT+SPACE', (data, cancel) => {
			cancel();

			editor.model.change(writer => {
				editor.model.insertContent(
					writer.createText('\u00A0')
				);
			});
		});
	}
}